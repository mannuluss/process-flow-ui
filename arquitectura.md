# Arquitectura del Sistema Process Flow V2 (Backend Node.js)

## 1. Estructura del Repositorio (Monorepo)

Se utilizará una arquitectura de **Monorepo** gestionada con **pnpm workspaces**. Esto permite compartir código (tipos, utilidades) entre el frontend y el backend sin duplicar definiciones.

```text
/ (root)
├── apps/
│   ├── frontend/           # (Tu proyecto actual React + Vite)
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── backend/            # (Nuevo proyecto NestJS)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── workflow/
│       │   │   ├── engine/
│       │   │   └── ...
│       ├── package.json
│       └── ...
│
├── packages/
│   └── common/             # Librería interna de tipos compartidos
│       ├── src/
│       │   ├── types/      # Interfaces (Node, Edge, RuleConfig)
│       │   └── dtos/       # DTOs para la API (CreateWorkflowDto, etc.)
│       └── package.json
│
├── scripts/                # Scripts SQL y configuración DB
│   ├── init_db_v2.sql            # Script inicial (PROCESS_TABLE_V2.sql)
│   └── seeds/              # Datos de prueba
│
├── docker/                 # Configuración de contenedores
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml      # Orquestación local
├── package.json            # Root config
└── pnpm-workspace.yaml     # Definición del workspace
```

---

## 2. Stack Tecnológico

- **Lenguaje:** TypeScript (Estricto).
- **Runtime:** Node.js (LTS).
- **Framework Backend:** **NestJS**.
  - _Razón:_ Provee arquitectura modular, inyección de dependencias y validación robusta, similar a Spring Boot pero en el ecosistema JS.
- **Base de Datos:** PostgreSQL.
- **ORM & Migraciones:** **TypeORM**.
  - _Razón:_ Excelente manejo de esquemas relacionales y migraciones automáticas.
- **Validación de Reglas:** Motor propio basado en **Strategy Pattern**.

---

## 2. Diseño Modular (NestJS)

El backend se dividirá en módulos funcionales para mantener la separación de responsabilidades.

### A. `WorkflowModule` (Gestión)

Encargado del CRUD de las definiciones.

- **Controller:** `POST /workflows`, `GET /workflows/:id`.
- **Service:** Guarda y versiona el JSON del grafo.
- **Validación:** Verifica que el JSON del grafo sea válido (nodos conectados, estructura correcta) antes de guardar.

### B. `EngineModule` (El Corazón)

Encargado de la ejecución de la máquina de estados.

- **Controller:** `POST /engine/execute`.
- **Service:** `WorkflowEngineService`.
  - Método `executeTransition(instanceId, trigger, context)`.
  - Carga la instancia y el grafo.
  - Busca aristas salientes.
  - Invoca al `RulesService`.
  - Actualiza el estado en BD y registra en el Log.

### C. `RulesModule` (Evaluador)

Implementa el patrón Strategy para evaluar las condiciones.

- **Interface:** `RuleStrategy { validate(params, context): Promise<boolean> }`.
- **Implementaciones:**
  - `RoleCheckStrategy`: Valida roles del usuario.
  - `SqlCheckStrategy`: Ejecuta consultas de validación.
  - `DocumentCheckStrategy`: Valida estados de documentos.
- **Factory:** Selecciona la estrategia según el `type` definido en el JSON de la arista.

### D. `DataSourceModule` (Integración Low-Code)

Maneja la ejecución de consultas SQL dinámicas para el frontend y las reglas.

- **Gestión de Conexiones:**
  - **Conexión Sistema:** Acceso RW a las tablas del motor (`workflows`, `instances`).
  - **Conexión Negocio:** Acceso RO (Read-Only) a las tablas de la empresa (para consultas dinámicas).
- **Service:** `QueryExecutorService`.
  - Ejecuta las queries guardadas en la tabla `data_sources`.
  - Previene inyección SQL usando parámetros nombrados.

---

## 3. Estrategia de Base de Datos y Migraciones

Para lograr el despliegue "tipo n8n" (Docker y listo), el sistema gestionará su propio esquema.

1.  **Migraciones al Inicio:**
    - Al levantar el contenedor, el script de arranque (`npm run start:prod`) ejecutará automáticamente `typeorm migration:run`.
    - Esto asegura que la DB siempre tenga las tablas `workflows`, `instances`, etc., creadas.

2.  **Seeds (Datos Semilla):**
    - Se incluirá un seed opcional para crear flujos de ejemplo o consultas de sistema básicas.

---

## 4. Flujo de Ejecución (Engine Algorithm)

```typescript
// Pseudocódigo del EngineService

async executeTransition(instanceId: string, trigger: string, userContext: any) {
  // 1. Obtener Instancia y Definición
  const instance = await this.instanceRepo.findOne(instanceId);
  const workflow = await this.workflowRepo.findOne(instance.workflowId);

  // 2. Buscar Nodo Actual
  const currentNode = workflow.definition.nodes.find(n => n.id === instance.currentNodeId);

  // 3. Buscar Aristas Candidatas (que salgan del nodo y tengan el trigger)
  const candidates = workflow.definition.edges.filter(e =>
    e.source === currentNode.id && e.data.trigger === trigger
  );

  // 4. Evaluar Reglas
  for (const edge of candidates) {
    const allRulesPassed = await this.rulesService.evaluate(edge.data.rules, userContext);

    if (allRulesPassed) {
      // 5. Transición Exitosa
      instance.currentNodeId = edge.target;
      await this.instanceRepo.save(instance);
      await this.logTransition(instance, edge, trigger);
      return { success: true, newState: edge.target };
    }
  }

  throw new Error("No se cumplen las condiciones para avanzar.");
}
```

---

## 5. Seguridad (Aislamiento de SQL)

Para cumplir con el requisito de seguridad en las consultas dinámicas:

1.  **Doble Pool de Conexiones:**
    - `TypeORM Module` (Default): Conectado a la DB del Workflow.
    - `Raw SQL Module`: Conectado a la DB del Negocio.
2.  **Usuario de DB Restringido:**
    - La conexión "Raw SQL" debe usar credenciales de DB que SOLO tengan `GRANT SELECT` sobre las tablas de negocio.
    - Esto garantiza que aunque alguien inyecte un `DROP TABLE` en el editor visual, la base de datos lo rechace.

---

## 6. Despliegue (Docker)

El proyecto tendrá un `Dockerfile` optimizado (Multi-stage build) y un `docker-compose.yml` para desarrollo local.

**Estructura de Contenedores:**

- `app-backend`: Node.js (NestJS).
- `app-frontend`: Nginx sirviendo los estáticos de Vite.
- `db-postgres`: PostgreSQL 15+.

```yaml
# Ejemplo docker-compose
services:
  backend:
    build: ./backend
    environment:
      - DB_HOST=postgres
      - BUSINESS_DB_USER=readonly_user
    command: sh -c "npm run migration:run && npm run start:prod"
```

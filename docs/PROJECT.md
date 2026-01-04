# Process Flow - Documentación del Proyecto

## 1. Visión General del Proyecto

**Process Flow** es una plataforma integral diseñada para la orquestación, diseño y ejecución de flujos de trabajo (workflows) dinámicos. Su objetivo principal es permitir a los usuarios definir procesos de negocio mediante una interfaz visual intuitiva, conectando diversas fuentes de datos y aplicando reglas de negocio complejas sin necesidad de modificar el código base constantemente.

La lógica central del proyecto gira en torno a la flexibilidad:
- **Diseño Visual:** Los procesos se modelan como grafos (Nodos y Aristas).
- **Conectividad:** Capacidad de integrarse con sistemas externos (Bases de Datos SQL, APIs REST).
- **Reglas Dinámicas:** Evaluación de condiciones en tiempo real para determinar el flujo del proceso.

## 2. Arquitectura del Sistema (Monorepo)

El proyecto está estructurado como un **Monorepo** gestionado con `pnpm workspaces`, lo que permite compartir código y configuraciones de manera eficiente entre el cliente y el servidor.

### Estructura de Alto Nivel
- **`apps/frontend`**: La interfaz de usuario construida con React.
- **`apps/backend`**: El servidor API y motor de reglas construido con NestJS.
- **`packages/common`**: Librería compartida que actúa como la "Fuente de Verdad" para tipos de datos, interfaces y utilidades.

---

## 3. Lógica de Negocio y Conceptos Clave

### Fuentes de Datos (Data Sources)
El sistema no almacena toda la información, sino que actúa como un orquestador. Las "Fuentes de Datos" son configuraciones que permiten al sistema consultar información externa.
- **Tipos Soportados:** Consultas SQL directas y Peticiones HTTP (API).
- **Uso:** Estas fuentes se utilizan dentro de las reglas para validar condiciones (ej. "¿El usuario tiene facturas pendientes en la DB de facturación?").

### Reglas (Rules)
Son las unidades lógicas que gobiernan las transiciones entre nodos del proceso.
- **Ejemplos:** Verificar rol de usuario, consultar estado de un documento, validar respuesta de una API.
- **Evaluación:** El backend evalúa estas reglas en tiempo de ejecución basándose en el contexto del proceso.

### Flujos (Flows)
Representación visual del proceso. Utiliza librerías de grafos (como React Flow) en el frontend para permitir a los usuarios "dibujar" la lógica del negocio.

---

## 4. Estándares de Desarrollo

Para mantener la calidad y coherencia del código, seguimos estrictamente las siguientes directrices:

### A. Gestión de Paquetes
- Utilizamos **pnpm** exclusivamente.
- Las dependencias compartidas deben residir o definirse en el workspace raíz o en `packages/common` si es código.

### B. Tipado Compartido (`packages/common`)
- **Regla de Oro:** Si un tipo de dato (DTO, Interface, Enum) se usa tanto en el Backend como en el Frontend, **DEBE** definirse en `packages/common`.
- Esto evita discrepancias entre lo que envía la API y lo que espera el cliente.

### C. Frontend (React + Vite + Ant Design)
- **Arquitectura:** Basada en **Features** (`src/features/nombre-feature`). Cada feature contiene sus propios componentes, hooks y servicios.
- **Diseño:** Uso estricto de **Ant Design Tokens**.
  - ❌ Prohibido: `style={{ color: '#ff0000' }}` o archivos CSS/SCSS con valores quemados.
  - ✅ Correcto: `const { token } = theme.useToken(); color: token.colorError`.
- **Lógica:** Desacoplada de la UI mediante **Custom Hooks**.
- **Testing:** Vitest enfocado en lógica (hooks/utils), no en renderizado de componentes (salvo excepciones).

### D. Backend (NestJS + TypeORM)
- **Base de Datos:** PostgreSQL.
- **Cambios de Schema:** Siempre mediante **Migraciones** de TypeORM. Nunca usar `synchronize: true` en producción.
- **Estructura:** Modular estándar de NestJS (Controller -> Service -> Repository).

### E. Calidad de Código (Linting)
- Se prioriza el desarrollo fluido de la funcionalidad.
- El formateo y linting se aplican al finalizar la tarea o módulo.
- Comandos clave:
  - Frontend: `pnpm run lint:js:fix`
  - Backend: `npm run lint`

---

## 5. Herramientas Principales
- **Lenguaje:** TypeScript (Fullstack).
- **UI:** React, Ant Design, Monaco Editor (para edición de SQL/JSON).
- **API:** NestJS, Axios.
- **ORM:** TypeORM.
- **Testing:** Vitest (Front), Jest (Back).

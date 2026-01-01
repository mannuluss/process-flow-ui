# Arquitectura Process Flow V2: Modelo de Máquina de Estados

Este documento define la estructura de datos y la lógica de negocio para la versión 2 del motor de flujos. El objetivo es desacoplar la lógica de los nodos visuales y centralizarla en las transiciones (aristas), permitiendo un sistema flexible y escalable.

## 1. Filosofía Core
- **Nodos (States):** Son pasivos. Representan *dónde* está el proceso.
- **Aristas (Transitions):** Son activas. Representan *cómo* y *cuándo* se mueve el proceso. Contienen las reglas de negocio.

---

## 2. Definición de Nodos (States)
Se utilizará un único tipo de nodo visual para representar los estados del proceso.

**Tipo de Nodo:** `proceso`

### Estructura de Datos (Node Payload)
```json
{
  "id": "node_1",
  "type": "proceso",
  "data": {
    "label": "Revisión Financiera", // Nombre visible del estado
    "description": "Estado donde el auditor valida el presupuesto",
    "isInitial": false, // Indica si es el punto de entrada del flujo
    "isFinal": false,   // Indica si el flujo termina aquí
    "metadata": {       // Configuración extra opcional (ej. SLAs)
      "maxTimeInState": 48 // horas
    }
  }
}
```

---

## 3. Definición de Aristas (Transitions)
Las aristas contienen la lógica de evaluación. Una arista conecta dos nodos y define los requisitos para cruzar ese puente.

### Estructura de Datos (Edge Payload)
```json
{
  "id": "edge_1",
  "source": "node_1",
  "target": "node_2",
  "data": {
    "trigger": "ACCION_APROBAR", // Identificador de la acción que intenta disparar esto
    "rules": [ ... ]             // Array de condiciones (AND logic por defecto)
  }
}
```

---

## 4. Definición de Reglas (Rules)
Las reglas son objetos configurables dentro de una arista. El backend iterará sobre este array; todas las reglas deben retornar `true` para permitir la transición.

### A. Regla de Roles (`ROLE_CHECK`)
Valida si el usuario que ejecuta la acción tiene los permisos necesarios.

```json
{
  "type": "ROLE_CHECK",
  "params": {
    "allowedRoles": ["ADMIN", "GERENTE_FINANCIERO", "AUDITOR"]
  }
}
```

### B. Regla de Estado de Documento (`DOCUMENT_STATUS_CHECK`)
Valida si un documento específico asociado al proceso cumple con un estado requerido.

```json
{
  "type": "DOCUMENT_STATUS_CHECK",
  "params": {
    "documentId": "SOLICITUD_PRESUPUESTO", // ID lógico del documento
    "requiredStatus": "FIRMADO_DIGITALMENTE"
  }
}
```

### C. Regla de Validación SQL (`SQL_CHECK_CUSTOM`)
Permite ejecutar una consulta SQL directa para validar una condición de negocio compleja.
- **Lógica:** Si la consulta retorna al menos una fila, la regla se considera **CUMPLIDA (TRUE)**. Si no retorna filas, se considera **NO CUMPLIDA (FALSE)**.
- **Seguridad:** Se ejecuta con el usuario de base de datos restringido (solo lectura).

```json
{
  "type": "SQL_CHECK_CUSTOM",
  "params": {
    "sql": "SELECT 1 FROM presupuesto WHERE proyecto_id = :processId AND saldo_disponible > 0",
    "errorMessage": "No hay saldo suficiente en el presupuesto del proyecto."
  }
}
```

---

## 5. Lógica de Ejecución (Backend)

El "Ejecutor" en el backend funcionará bajo el siguiente algoritmo al recibir una petición:

**Input:**
- `processInstanceId`: ID de la instancia en ejecución.
- `trigger`: Acción enviada por el usuario (ej. "ACCION_APROBAR").
- `context`: Datos del usuario (roles) y del proceso actual (documentos, variables).

**Algoritmo:**
1. **Identificar Estado Actual:** Buscar en BD en qué `nodeId` se encuentra la instancia.
2. **Buscar Caminos:** Obtener todas las aristas donde `source == currentNodeId`.
3. **Filtrar por Trigger:** Descartar aristas donde `edge.data.trigger != input.trigger`.
4. **Evaluar Reglas (Rules Engine):**
   - Para cada arista candidata:
     - Iterar sobre `edge.data.rules`.
     - Ejecutar validador según `rule.type` (RoleValidator, DocumentValidator, etc.).
     - Si alguna regla falla, descartar la arista.
5. **Transición:**
   - Si una arista pasa todas las validaciones -> Actualizar estado del proceso a `edge.target`.
   - Si ninguna pasa -> Retornar error o denegar acción.

---

## 6. Ejemplo Completo (JSON Contract)

```json
{
  "nodes": [
    { "id": "1", "type": "proceso", "data": { "label": "Borrador", "isInitial": true } },
    { "id": "2", "type": "proceso", "data": { "label": "Aprobado" } }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2",
      "data": {
        "trigger": "ENVIAR_A_APROBACION",
        "rules": [
          {
            "type": "ROLE_CHECK",
            "params": { "allowedRoles": ["CREADOR", "EDITOR"] }
          },
          {
            "type": "DOCUMENT_STATUS_CHECK",
            "params": { "documentId": "ANEXO_TECNICO", "requiredStatus": "CARGADO" }
          }
        ]
      }
    }
  ]
}
```

---

## 7. Integración de Datos y SQL Dinámico (Low-Code)

Para maximizar la flexibilidad y permitir que el usuario configurador defina el comportamiento sin tocar el código del backend, el sistema permite la definición y ejecución de consultas SQL directamente desde la interfaz.

### 7.1 Seguridad y Arquitectura
- **Backend Orquestador:** El backend actúa como un pasarela de ejecución. No contiene lógica de negocio "dura", sino que interpreta las definiciones del flujo.
- **Conexión Restringida:** Para mitigar riesgos de seguridad (como inyección SQL destructiva), el backend se conecta a la base de datos de negocio utilizando un usuario de base de datos con **permisos estrictamente limitados** (ej. solo `SELECT` en tablas específicas, sin permisos de `DROP`, `DELETE`, `UPDATE`).

### 7.2 Definición de Consultas en Frontend
El editor de flujos incluirá un panel para configurar "Fuentes de Datos".

**Estructura de una Fuente de Datos:**
```json
{
  "id": "DS_ROLES",
  "name": "Listado de Roles Activos",
  "type": "SQL",
  "query": "SELECT id_rol, nombre_rol FROM seguridad.roles WHERE estado = 'ACTIVO'",
  "mapping": {
    "valueField": "id_rol",   // Campo que se usará como ID interno
    "labelField": "nombre_rol" // Campo que se mostrará en el dropdown
  }
}
```

### 7.3 Uso en Reglas y Listas
Estas fuentes de datos se utilizan para:
1.  **Poblar Selectores:** Al configurar una regla `ROLE_CHECK`, el dropdown de roles disponibles se llena ejecutando la consulta `DS_ROLES`.
2.  **Validaciones Dinámicas (SQL_CHECK_CUSTOM):**
    - Se permite inyectar SQL directo en las expresiones personalizadas (con precaución).
    - Ejemplo: `SELECT 1 FROM facturas WHERE id = :id AND monto > 5000`
    - Si la consulta retorna filas, la regla se cumple.

### 7.4 Configuración de Campos Dinámicos
Para facilitar la creación de consultas sin escribir SQL manual siempre, la UI puede ofrecer un constructor visual:
- **Tabla:** Selección de tabla (ej. `roles`).
- **Campos:** Selección de columnas para ID y Etiqueta.
- **Filtros:** Condiciones básicas (`WHERE activo = true`).
Esto genera el SQL automáticamente por debajo.

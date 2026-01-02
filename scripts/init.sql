-- ==============================================================================
-- Esquema de Base de Datos para Process Flow V2 (PostgreSQL)
-- ==============================================================================

-- 1. Tabla de Definición de Flujos (Workflows)
-- Almacena la estructura del grafo (nodos y aristas) y su configuración.
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,

    -- El JSON completo con { nodes: [], edges: [] } según PROCESS_FLOW_V2.md
    definition JSONB NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por estado activo
CREATE INDEX idx_workflows_active ON workflows(is_active);


-- 2. Tabla de Instancias de Proceso (Ejecución)
-- Representa un proceso vivo (ej. "Solicitud de Compra #123").
CREATE TABLE process_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id),

    -- ID del nodo actual (debe coincidir con un id en workflows.definition->'nodes')
    current_node_id VARCHAR(255) NOT NULL,

    -- Estado general de la instancia (ACTIVE, COMPLETED, CANCELLED, PAUSED)
    status VARCHAR(50) DEFAULT 'ACTIVE',

    -- Contexto de datos del proceso (variables, ids de documentos, montos, etc.)
    -- Esto permite que las reglas SQL accedan a datos específicos de esta instancia.
    context JSONB DEFAULT '{}',

    created_by VARCHAR(255), -- ID del usuario que inició el proceso
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_process_instances_workflow ON process_instances(workflow_id);
CREATE INDEX idx_process_instances_status ON process_instances(status);


-- 3. Historial de Transiciones (Auditoría)
-- Registra cada movimiento de un nodo a otro.
CREATE TABLE process_transitions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_instance_id UUID NOT NULL REFERENCES process_instances(id),

    from_node_id VARCHAR(255) NOT NULL,
    to_node_id VARCHAR(255) NOT NULL,

    -- La acción (trigger) que provocó el cambio
    trigger_action VARCHAR(255) NOT NULL,

    -- Resultado de la evaluación de reglas (opcional, para debug)
    rules_evaluation_snapshot JSONB,

    performed_by VARCHAR(255), -- Usuario que ejecutó la acción
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    comments TEXT -- Observaciones opcionales
);

CREATE INDEX idx_transitions_instance ON process_transitions_log(process_instance_id);


-- 4. Fuentes de Datos (Data Sources)
-- Almacena las consultas SQL o Endpoints API configurados para llenar listas en el frontend.
CREATE TABLE data_sources (
    id VARCHAR(50) PRIMARY KEY, -- Ej: 'DS_ROLES', 'DS_USERS_API'
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Tipo de fuente: 'SQL' o 'API'
    source_type VARCHAR(20) NOT NULL DEFAULT 'SQL',

    -- Configuración SQL (Requerido si source_type = 'SQL')
    query_sql TEXT,

    -- Configuración API (Requerido si source_type = 'API')
    api_url TEXT,
    api_method VARCHAR(10) DEFAULT 'GET',
    api_headers JSONB DEFAULT '{}',

    -- Configuración de mapeo para el frontend
    -- Ej: { "valueField": "id", "labelField": "name", "responsePath": "data.items" }
    mapping_config JSONB NOT NULL,

    -- Estado de la fuente de datos (SUCCESS, ERROR) - Resultado de la última prueba
    status VARCHAR(20) DEFAULT 'PENDING',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_source_config CHECK (
        (source_type = 'SQL' AND query_sql IS NOT NULL) OR
        (source_type = 'API' AND api_url IS NOT NULL)
    )
);

-- ==============================================================================
-- Ejemplo de Insert para un Workflow Básico
-- ==============================================================================
/*
INSERT INTO workflows (name, definition) VALUES (
    'Proceso de Aprobación de Gastos',
    '{
        "nodes": [
            { "id": "start", "type": "proceso", "data": { "label": "Inicio", "isInitial": true } },
            { "id": "approval", "type": "proceso", "data": { "label": "Aprobación Gerente" } },
            { "id": "end", "type": "proceso", "data": { "label": "Finalizado", "isFinal": true } }
        ],
        "edges": [
            {
                "source": "start",
                "target": "approval",
                "data": {
                    "trigger": "SUBMIT",
                    "rules": []
                }
            },
            {
                "source": "approval",
                "target": "end",
                "data": {
                    "trigger": "APPROVE",
                    "rules": [
                        { "type": "ROLE_CHECK", "params": { "allowedRoles": ["MANAGER"] } }
                    ]
                }
            }
        ]
    }'
);
*/

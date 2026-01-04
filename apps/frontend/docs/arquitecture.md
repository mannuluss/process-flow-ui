# Arquitectura del Frontend

Este documento describe la estructura de carpetas y la organización modular propuesta para escalar la aplicación `process-flow-ui`. El objetivo es separar responsabilidades técnicas de las responsabilidades de negocio (features).

## Estructura de Directorios

La estructura base dentro de `src/` se divide en 5 pilares principales:

```text
src/
├── core/                 # Configuración técnica global
├── shared/               # Utilidades y componentes reutilizables (UI Kit)
├── layouts/              # Estructuras de página (Layouts)
├── features/             # Módulos de negocio (Lógica principal)
└── pages/                # Vistas / Puntos de entrada de rutas
```

---

## Detalle de Directorios

### 1. Core (`src/core/`)
Contiene la configuración esencial que hace funcionar la aplicación, pero que no contiene lógica de negocio específica.

*   **`api/`**: Configuración de clientes HTTP (Axios/Fetch), interceptores y manejo de errores global.
*   **`router/`**: Configuración de rutas (`react-router`), guardias de navegación.
*   **`store/`**: Configuración del Store global (Redux/Zustand), middlewares.
*   **`theme/`**: Definiciones de diseño, tokens de Ant Design (`designSystem.ts`), estilos globales.
*   **`types/`**: Tipos de TypeScript globales o compartidos entre múltiples features.

### 2. Shared (`src/shared/`)
Elementos que son agnósticos al negocio y se usan en toda la aplicación. Podría considerarse nuestro "UI Kit" interno.

*   **`components/`**: Componentes "tontos" o presentacionales (ej: `LoadingSpinner`, `CustomCard`, `StatusBadge`).
*   **`hooks/`**: Hooks personalizados genéricos (ej: `useDebounce`, `useToggle`, `useLocalStorage`).
*   **`utils/`**: Funciones puras de ayuda (ej: formateadores de fecha, validadores de strings).

### 3. Layouts (`src/layouts/`)
Componentes que definen la estructura visual de las páginas.

*   **`MainLayout.tsx`**: Layout principal con Sidebar y Header.
*   **`AuthLayout.tsx`**: Layout para pantallas de autenticación (Login/Register).
*   **`CleanLayout.tsx`**: Layout vacío para páginas especiales (ej: 404).

### 4. Features (`src/features/`)
Aquí reside la lógica de negocio. Cada carpeta representa un dominio funcional de la aplicación.

#### `features/designer/` (Antes `src/app`)
Módulo encargado del diseñador de flujos (Canvas).
*   **`components/`**: Componentes específicos del diseñador (Canvas, Toolbar, Paneles).
*   **`nodes/`**: Definición y lógica de Nodos personalizados.
*   **`edges/`**: Definición y lógica de Conexiones personalizadas.
*   **`actions/`**: Lógica de comandos (Undo/Redo, Copy/Paste).
*   **`store/`**: Slices de Redux específicos para el estado del grafo.

#### `features/settings/`
Módulo de configuración y administración.
*   **`components/`**: Editores de fuentes de datos, listas de usuarios, formularios.
*   **`hooks/`**: Lógica para probar conexiones, guardar configuraciones.

### 5. Pages (`src/pages/`)
Son los puntos de entrada que el Router renderiza. Deben ser componentes "delgados" que principalmente orquestan componentes de `features` y `layouts`.

*   **`HomePage.tsx`**: Dashboard principal.
*   **`EditorPage.tsx`**: Página del diseñador (Renderiza `features/designer/Designer`).
*   **`SettingsPage.tsx`**: Página de ajustes (Renderiza `features/settings/SettingsContainer`).

---

## Reglas de Importación

1.  **Features no deben importarse entre sí directamente** (idealmente). Si dos features comparten lógica, esa lógica debe moverse a `shared` o `core`.
2.  **Pages** pueden importar de `features`, `layouts` y `shared`.
3.  **Shared** no puede importar de `features` ni `pages`.
4.  **Core** es la capa más baja, no importa de nadie (salvo librerías externas).

## Migración (Estado Actual vs Objetivo)

| Actual | Objetivo | Descripción |
| :--- | :--- | :--- |
| `src/app` | `src/features/designer` | El núcleo del editor visual. |
| `src/edges` | `src/features/designer/edges` | Centralización de lógica de bordes. |
| `src/pages/settings/components` | `src/features/settings/components` | Componentes de configuración. |
| `src/theme` | `src/core/theme` | Configuración de estilos. |
| `src/store` | `src/core/store` | Configuración de estado global. |


```text
src/
├── core/                 # El "núcleo" técnico de la app
│   ├── api/              # Configuración de Axios/Fetch
│   ├── router/           # Router.tsx y rutas
│   ├── store/            # Configuración del Store (Redux)
│   ├── theme/            # Design System y Tokens (designSystem.ts)
│   └── types/            # Tipos globales compartidos
│
├── shared/               # Lo que se usa en TODA la app (UI Kit)
│   ├── components/       # Componentes tontos (Button, Card, ModalWrapper)
│   ├── hooks/            # Hooks genéricos (useDebounce, useToggle)
│   └── utils/            # Funciones puras (formatDate, validaciones)
│
├── layouts/              # Estructuras visuales
│   ├── MainLayout.tsx    # Tu layout con Sidebar
│   └── AuthLayout.tsx    # Layout para login (si hubiera)
│
├── features/             # Módulos de Negocio (AQUÍ está el cambio fuerte)
│   │
│   ├── designer/         # (Refactor de tu carpeta 'app')
│   │   ├── components/   # Canvas, Toolbar, Paneles flotantes
│   │   ├── nodes/        # (Antes customs/nodes) Tus nodos personalizados
│   │   ├── edges/        # (Antes customs/edges + src/edges) Tus conexiones
│   │   ├── actions/      # (Antes app/actions) CommandManager, etc.
│   │   └── store/        # Slices de Redux específicos del designer
│   │
│   └── settings/         # Nuevo módulo de configuración
│       ├── components/   # DataSourcesList, SqlEditor, ApiEditor...
│       └── hooks/        # Lógica de conexión y testeo de fuentes
│
└── pages/                # Vistas (Puntos de entrada limpios)
    ├── HomePage.tsx
    ├── EditorPage.tsx    # Solo renderiza componentes de features/designer
    └── SettingsPage.tsx  # Solo renderiza componentes de features/settings
```

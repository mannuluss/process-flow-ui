### Prompt para IA: Configuración de Linting y Formateo para Proyectos React

**Rol:** Eres un experto en desarrollo frontend y herramientas de calidad de código.

**Objetivo:** Configurar un sistema robusto de linting y formateo para un proyecto existente basado en **React, Vite y TypeScript**. El sistema debe usar **ESLint**, **Prettier** y **Stylelint**, y estar documentado en el `README.md`.

**Contexto del Proyecto:**
*   **Framework/Librería:** React
*   **Bundler:** Vite
*   **Lenguaje:** TypeScript
*   **Estilos:** CSS / SCSS

Por favor, sigue estos pasos detallados:

**Paso 1: Instalar Dependencias de Desarrollo**

Instala las siguientes dependencias (`devDependencies`) utilizando `npm` o el gestor de paquetes del proyecto:
*   **ESLint (v9+):** `eslint`, `@eslint/js`, `typescript-eslint`.
*   **Plugins de ESLint:** `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, `eslint-plugin-simple-import-sort`.
*   **Integración con Prettier:** `eslint-config-prettier`.
*   **Stylelint:** `stylelint`, `stylelint-config-standard-scss`, `stylelint-config-prettier`.
*   **Prettier:** `prettier`.

**Paso 2: Configurar ESLint (Flat Config)**

1.  Crea un archivo `eslint.config.js` en la raíz del proyecto (elimina cualquier `.eslintrc.cjs` o similar si existe).
2.  La configuración debe incluir:
    *   Soporte para TypeScript (`typescript-eslint`).
    *   Reglas recomendadas para React (`eslint-plugin-react`, `eslint-plugin-react-hooks`).
    *   Reglas de accesibilidad (`eslint-plugin-jsx-a11y`).
    *   Reglas para ordenar importaciones (`eslint-plugin-simple-import-sort`).
    *   Desactivación de reglas conflictivas con Prettier (`eslint-config-prettier`) como último elemento del array de configuración.
    *   Ignorar archivos de configuración, build y `node_modules`.

**Paso 3: Configurar Stylelint**

1.  Crea un archivo `.stylelintrc.json` en la raíz del proyecto.
2.  La configuración debe:
    *   Extender `stylelint-config-standard-scss` y `stylelint-config-prettier`.
    *   Añadir una regla para validar la nomenclatura de clases y IDs. Deben seguir los patrones **kebab-case**, **snake_case** o **BEM**. Usa la siguiente expresión regular para la regla `selector-class-pattern`:
        ```regex
        ^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$
        ```

**Paso 4: Configurar Prettier**

1.  Crea un archivo `.prettierrc` en la raíz con una configuración básica (puedes usar la tuya o una estándar como esta):
    ```json
    {
      "semi": true,
      "singleQuote": true,
      "trailingComma": "es5",
      "printWidth": 80,
      "tabWidth": 2
    }
    ```
2.  Crea un archivo `.prettierignore` para excluir directorios como `dist`, `build` y `node_modules`.

**Paso 5: Añadir Scripts a `package.json`**

Añade los siguientes scripts a la sección `"scripts"` del archivo `package.json`:

```json
"scripts": {
  "lint": "npm run lint:js && npm run lint:css",
  "lint:fix": "npm run lint:js:fix && npm run lint:css:fix",
  "lint:js": "eslint . --ext .ts,.tsx",
  "lint:js:fix": "eslint . --ext .ts,.tsx --fix",
  "lint:css": "stylelint \"src/**/*.scss\"",
  "lint:css:fix": "stylelint \"src/**/*.scss\" --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,scss,css,json,md}\"",
  "imports:organize": "eslint . --ext .ts,.tsx --fix"
}
```

**Paso 6: Documentar en `README.md`**

Actualiza el archivo `README.md` añadiendo una nueva sección llamada **"Calidad de Código, Linting y Formateo"**. Esta sección debe incluir:

1.  **Descripción de Herramientas:** Una breve explicación de para qué sirven ESLint, Prettier y Stylelint.
2.  **Comandos Disponibles:** Una tabla que liste y describa cada uno de los scripts añadidos en el paso anterior.
3.  **Reglas de Estilo y Nomenclatura:**
    *   Explicar que los imports/exports se organizan automáticamente.
    *   Detallar la regla de nomenclatura para CSS/SCSS (kebab-case, snake_case, BEM).
4.  **Checklist para Desarrolladores:** Una pequeña lista de verificación que los desarrolladores deben seguir antes de subir su código, como por ejemplo:
    *   `[ ]` He ejecutado `npm run lint:fix` para corregir errores automáticos.
    *   `[ ]` He verificado con `npm run lint` que no quedan errores de linting.
    *   `[ ]` Mi código sigue las reglas de nomenclatura y estilo del proyecto.

**Paso 7: Aplicar Formato Inicial**

Como acción final, ejecuta el comando `npm run lint:fix` para aplicar las nuevas reglas a toda la base de código existente e informar sobre los errores que no se pudieron corregir automáticamente.

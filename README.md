# PROCESS FLOW UI

![](https://github.com/xyflow/web/blob/main/assets/codesandbox-header-ts.png?raw=true)

# React Flow starter (Vite + TS)

We've put together this template to serve as a starting point for folks
interested in React Flow. You can use this both as a base for your own React
Flow applications, or for small experiments or bug reports.

Vite is a great development server and build tool that we recommend our users to
use. You can start a development server with:

```bash
npm run dev
```

## 📋 Comandos Disponibles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor de desarrollo
npm run build               # Construir para producción
npm run preview             # Previsualizar build de producción

# Calidad de Código - JavaScript/TypeScript
npm run lint:js             # Verificar errores de linting JS/TS
npm run lint:js:fix         # Corregir errores de linting JS/TS automáticamente

# Calidad de Código - CSS/SCSS
npm run lint:css            # Verificar errores de linting CSS/SCSS
npm run lint:css:fix        # Corregir errores de linting CSS/SCSS automáticamente

# Calidad de Código - General
npm run lint                # Verificar errores de linting (JS/TS + CSS/SCSS)
npm run lint:fix            # Corregir errores de linting automáticamente
npm run format              # Verificar formato del código con Prettier
npm run format:fix          # Formatear código con Prettier
npm run type-check          # Verificar tipos de TypeScript
npm run check-all           # Ejecutar todas las verificaciones de calidad

# Organización de imports
npm run imports:organize    # Organizar y limpiar imports automáticamente
```

## 🚀 Contribución y Estándares de Código

### Reglas para Pull Requests / Merge Requests

Antes de enviar un PR/MR a las ramas principales (`main`, `develop`), asegúrate de que tu código cumple con los siguientes estándares de calidad. **El pipeline de CI/CD ejecutará estas verificaciones automáticamente y rechazará el merge si alguna falla.**

#### ✅ Verificaciones Obligatorias

1. **Linting JavaScript/TypeScript**: El código debe pasar todas las reglas de ESLint
   ```bash
   npm run lint:js
   ```

2. **Linting CSS/SCSS**: Los estilos deben cumplir con las reglas de Stylelint
   ```bash
   npm run lint:css
   ```

   **Reglas de nomenclatura para clases CSS/SCSS:**
   - ✅ **kebab-case**: `my-class-name`, `button-primary`
   - ✅ **snake_case**: `my_class_name`, `button_primary`
   - ✅ **BEM con doble guión bajo**: `react-flow__node-proceso`, `component__element-modifier`

3. **Formateo**: El código debe estar correctamente formateado con Prettier
   ```bash
   npm run format
   ```

4. **Tipos**: No debe haber errores de TypeScript
   ```bash
   npm run type-check
   ```

5. **Build**: El proyecto debe compilar sin errores
   ```bash
   npm run build
   ```

#### 🔧 Comando de Verificación Completa

Ejecuta este comando antes de hacer commit para asegurar que tu código cumple todos los estándares:

```bash
npm run check-all
```

#### 📝 Proceso Recomendado

1. **Antes de hacer commit:**
   ```bash
   npm run check-all          # Verificar calidad
   npm run lint:fix           # Corregir errores automáticamente (si es necesario)
   npm run format:fix         # Formatear código (si es necesario)
   npm run imports:organize   # Organizar imports (si es necesario)
   ```

2. **Ejecutar tests (cuando estén implementados):**
   ```bash
   npm run test               # Ejecutar suite de tests
   ```

3. **Verificar que el build funciona:**
   ```bash
   npm run build              # Debe completarse sin errores
   ```

#### ⚠️ Pipeline de CI/CD

El pipeline automatizado ejecutará las siguientes verificaciones:
- ✅ Instalación de dependencias
- ✅ Verificación de tipos TypeScript
- ✅ Linting JavaScript/TypeScript con ESLint
- ✅ Linting CSS/SCSS con Stylelint
- ✅ Verificación de formato con Prettier
- ✅ Organización de imports/exports
- ✅ Build de producción
- ✅ Tests unitarios (cuando estén implementados)
- ✅ Tests de integración (cuando estén implementados)

**Si cualquiera de estas verificaciones falla, el PR/MR será rechazado automáticamente.**

### 🎨 Reglas de Estilos CSS/SCSS

Este proyecto utiliza **Stylelint** para mantener la consistencia en los estilos. Las reglas principales incluyen:

#### Nomenclatura de Clases CSS
Se permiten los siguientes formatos para nombres de clases:

1. **kebab-case** (recomendado para CSS estándar):
   ```css
   .my-component {}
   .button-primary {}
   .nav-menu-item {}
   ```

2. **snake_case** (alternativa válida):
   ```css
   .my_component {}
   .button_primary {}
   .nav_menu_item {}
   ```

3. **BEM con doble guión bajo** (para componentes complejos):
   ```css
   .component__element {}
   .react-flow__node-proceso {}
   .menu__item--active {}
   ```

#### Otras Reglas de Estilos
- **Colores hexadecimales**: Usar formato corto cuando sea posible (`#fff` en lugar de `#ffffff`)
- **Funciones de color**: Preferir `rgb()` sobre `rgba()` cuando no se necesita transparencia
- **Comentarios SCSS**: Los comentarios `//` deben tener un espacio después de las barras
- **Prefijos vendor**: Permitidos cuando sean necesarios para compatibilidad

#### Verificación de Estilos
```bash
# Verificar errores de estilo
npm run lint:css

# Corregir errores automáticamente
npm run lint:css:fix
```

#### 📋 Checklist para Contributors

- [ ] El código pasa `npm run check-all`
- [ ] Los estilos CSS/SCSS siguen las reglas de nomenclatura (kebab-case, snake_case, o BEM)
- [ ] Se han agregado tests para nueva funcionalidad
- [ ] La documentación ha sido actualizada (si aplica)
- [ ] Los commits siguen el formato convencional
- [ ] No hay console.logs o código de debug
- [ ] Las dependencias nuevas están justificadas
- [ ] Los imports están organizados correctamente


## 🧪 Pruebas Unitarias

El proyecto utiliza [Vitest](https://vitest.dev/) como framework de pruebas unitarias. Vitest ofrece una experiencia de desarrollo rápida y moderna, perfectamente integrada con el ecosistema Vite.

### Comandos para Pruebas

```bash
# Ejecutar pruebas unitarias una vez
npm run test

# Ejecutar pruebas en modo watch (desarrollo)
npm run test:watch

# Ejecutar pruebas con interfaz gráfica
npm run test:ui

# Generar informe de cobertura
npm run test:coverage

# Ejecutar pruebas para CI/CD (genera reportes XML para SonarQube)
npm run test:ci
```

### Estructura de Pruebas

- Los archivos de prueba deben tener la extensión `.test.tsx` o `.test.ts`
- Cada archivo de prueba debe ubicarse junto al componente o módulo que está probando
- Utiliza React Testing Library para probar componentes de React

### Ejemplo Básico de Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Extensión Recomendada para VS Code

Para una mejor experiencia de desarrollo con Vitest, recomendamos instalar la extensión [Vitest Explorer](https://marketplace.visualstudio.com/items?itemName=vitest.explorer). Esta extensión proporciona:

- Ejecución de pruebas directamente desde la interfaz de VS Code
- Visualización de resultados de pruebas en tiempo real
- Depuración integrada de pruebas
- Integración con el CodeLens para ejecutar tests específicos

![Vitest Explorer Screenshot](https://github.com/vitest-dev/vitest/blob/main/docs/public/annotations-html-dark.png?raw=true)

### Reportes de Cobertura

El comando `npm run test:coverage` genera informes detallados de cobertura de código:

- **HTML**: Un reporte interactivo navegable en `coverage/lcov-report/index.html`
- **Cobertura XML**: Para integración con SonarQube en `coverage/cobertura-report/cobertura.xml`
- **JUnit XML**: Para integración con sistemas CI/CD en `coverage/junit-report/junit.xml`

### Buenas Prácticas

- Escribir tests enfocados en el comportamiento, no en la implementación
- Preferir consultas por rol o texto sobre consultas por ID
- Utilizar `beforeEach` para configuraciones repetitivas
- Mock de dependencias complejas con `vi.mock()`
- Mantener los tests simples, rápidos e independientes entre sí


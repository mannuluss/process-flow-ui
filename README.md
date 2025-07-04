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

# Calidad de Código
npm run lint                # Verificar errores de linting
npm run lint:fix            # Corregir errores de linting automáticamente
npm run format              # Formatear código con Prettier
npm run format:check        # Verificar formato del código
npm run type-check          # Verificar tipos de TypeScript
npm run check-all           # Ejecutar todas las verificaciones de calidad
```

## 🚀 Contribución y Estándares de Código

### Reglas para Pull Requests / Merge Requests

Antes de enviar un PR/MR a las ramas principales (`main`, `develop`), asegúrate de que tu código cumple con los siguientes estándares de calidad. **El pipeline de CI/CD ejecutará estas verificaciones automáticamente y rechazará el merge si alguna falla.**

#### ✅ Verificaciones Obligatorias

1. **Linting**: El código debe pasar todas las reglas de ESLint
   ```bash
   npm run lint
   ```

2. **Formateo**: El código debe estar correctamente formateado con Prettier
   ```bash
   npm run format:check
   ```

3. **Tipos**: No debe haber errores de TypeScript
   ```bash
   npm run type-check
   ```

4. **Build**: El proyecto debe compilar sin errores
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
   npm run format             # Formatear código (si es necesario)
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
- ✅ Linting con ESLint
- ✅ Verificación de formato con Prettier
- ✅ Build de producción
- ✅ Tests unitarios (cuando estén implementados)
- ✅ Tests de integración (cuando estén implementados)

**Si cualquiera de estas verificaciones falla, el PR/MR será rechazado automáticamente.**

#### 📋 Checklist para Contributors

- [ ] El código pasa `npm run check-all`
- [ ] Se han agregado tests para nueva funcionalidad
- [ ] La documentación ha sido actualizada (si aplica)
- [ ] Los commits siguen el formato convencional
- [ ] No hay console.logs o código de debug
- [ ] Las dependencias nuevas están justificadas


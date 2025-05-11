# Documentación del Tipo `CustomNodeStart`

El tipo `CustomNodeStart` representa un nodo de inicio personalizado dentro de la aplicación de flujo de procesos. Está basado en el tipo `Node` de la librería `@xyflow/react`.

## Representación JSON Ejemplo

A continuación, se muestra un ejemplo de cómo se vería un objeto de tipo `CustomNodeStart` en formato JSON:

```json
{
  "id": "un_id_unico_para_el_nodo",
  "position": { "x": 50, "y": 100 },
  "data": {
    "label": "Inicio del Proceso",
    "initial": true,
    "end": false,
    "metadata": {
      "version": "1.0",
      "responsable": "Equipo A"
    }
  },
  "type": "start"
  // Otras propiedades opcionales de un nodo de @xyflow/react podrían ir aquí, como:
  // "style": { "borderColor": "green", "borderWidth": 2 },
  // "className": "nodo-inicio-personalizado",
  // "sourcePosition": "right",
  // "hidden": false,
  // "selected": false,
  // "dragging": false,
  // "draggable": true,
  // "selectable": true,
  // "connectable": true,
  // "width": 180,
  // "height": 60
}
```

## Explicación de las Propiedades

### Propiedades Base (heredadas de `@xyflow/react Node`)

*   **`id`** (`string`): Un identificador único para el nodo. Es obligatorio.
*   **`position`** (`{ x: number, y: number }`): Un objeto con coordenadas `x` e `y` que define la ubicación inicial del nodo en el lienzo. Es obligatorio.
*   **`type`** (`"start"`): Una cadena que especifica el tipo de nodo. Para `CustomNodeStart`, este valor siempre será `"start"`. Es obligatorio.

### Propiedades Específicas (`data` object)

El objeto `data` contiene las propiedades personalizadas para `CustomNodeStart`:

*   **`label`** (`string`): El nombre del nodo que se muestra en la interfaz de usuario.
    *   *Comentario en el código:* `//nombre del nodo que se muestra en la interfaz`
*   **`initial`** (`boolean`): Indica si este nodo es el nodo inicial del flujo.
    *   *Comentario en el código:* `// indica si el nodo es el inicial`
*   **`end`** (`boolean`): Indica si este nodo es un nodo final del flujo. Para un nodo de tipo `"start"`, esto usualmente sería `false`.
    *   *Comentario en el código:* `// indica si el nodo es el final`
*   **`metadata`** (`any`, opcional): Permite almacenar información adicional o características específicas del nodo. Su estructura puede variar según las necesidades.
    *   *Comentario en el código:* `// informacion adicional del nodo que le da sus caracteristicas`

### Otras Propiedades Opcionales de `@xyflow/react Node`

Adicionalmente a las propiedades mencionadas, un `CustomNodeStart` puede incluir otras propiedades opcionales estándar de los nodos de `@xyflow/react`, tales como:

*   `style`: Para aplicar estilos CSS en línea.
*   `className`: Para asignar clases CSS.
*   `sourcePosition`, `targetPosition`: Para definir los puntos de conexión de los bordes.
*   `hidden`: Para ocultar el nodo.
*   `selected`: Para marcar el nodo como seleccionado.
*   `draggable`, `selectable`, `connectable`: Para controlar la interactividad del nodo.
*   `width`, `height`: Para definir dimensiones específicas.
*   Y otras más detalladas en la documentación de `@xyflow/react`.


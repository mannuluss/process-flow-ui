import environments from "../../environments/environments";
// Asegúrate de que EventPayloadMap esté exportado desde message.ts
import { CrossAppMessage, EventFlowTypes } from "../types/message"; // EventPayloadMap puede que ya no sea necesaria aquí directamente, pero la dejamos por si acaso en el futuro

// Callback ahora recibe el mensaje completo
export type MessageCallback = (message: CrossAppMessage) => void;

// El registro almacena callbacks genéricos
type SubscriptionRegistry = Map<string, Set<MessageCallback>>;

// --- Estado del Servicio (Singleton) ---
let isInitialized = false;
const subscriptions: SubscriptionRegistry = new Map();

// --- Funciones Principales ---

// Listener único para todos los mensajes entrantes
const handleIncomingMessage = (event: MessageEvent): void => {
  //Ignorar mismo origin en desarrollo
  if (window.location.origin === event.origin) {
    return;
  }
  // 1. Validar Origen (¡CRUCIAL!)
  // Corregido: permitir mensajes DESDE los hosts configurados
  if (!environments.targetHost.some((host) => event.origin.includes(host))) {
    console.warn(`Mensaje ignorado de origen no confiable: ${event.origin}`);
    return;
  }

  // 2. Validar estructura básica del mensaje
  const message = event.data as CrossAppMessage;
  if (
    typeof message !== "object" ||
    message === null ||
    typeof message.type !== "string" ||
    !Object.values(EventFlowTypes).includes(message.type as EventFlowTypes) // Validar que type sea un EventFlowTypes conocido
  ) {
    console.warn(
      "Mensaje ignorado: formato inválido o tipo desconocido.",
      message
    );
    return;
  }

  console.debug(
    `[MessagingService] Mensaje recibido: Tipo=${message.type}`,
    (message as any).payload // Accedemos al payload si existe
  );

  // 3. Notificar a los suscriptores, pasando el mensaje completo
  const callbacks = subscriptions.get(message.type);
  if (callbacks) {
    callbacks.forEach((callback) => {
      try {
        // Pasamos el objeto 'message' completo al callback
        callback(message);
      } catch (error) {
        console.error(
          `[MessagingService] Error al ejecutar callback para tipo ${message.type}:`,
          error
        );
      }
    });
  }
};

// Inicializa el listener principal (solo una vez)
const initialize = (): void => {
  if (!isInitialized) {
    console.log(
      `[MessagingService] Inicializando listener para origen: ${environments.targetHost}`
    );
    window.addEventListener("message", handleIncomingMessage);
    isInitialized = true;
    // Opcional: Informar a Angular que React está listo
    // sendMessage({ type: EventFlowTypes.REACT_APP_READY }); // Ejemplo de cómo enviar sin payload
  }
};

// Función para enviar mensajes a Angular (Simplificada)
export const sendMessage = (message: CrossAppMessage): void => {
  if (!window.parent || window.parent === window) {
    console.error(
      "[MessagingService] No se puede enviar mensaje: No se detecta un contenedor padre (iframe)."
    );
    return;
  }

  console.debug(
    `[MessagingService] Enviando mensaje: Tipo=${message.type}`,
    (message as any).payload
  );
  try {
    environments.targetHost.forEach((host) => {
      window.top?.postMessage(message, host);
    });
  } catch (error) {
    console.error(
      `[MessagingService] Error al enviar mensaje tipo ${message.type}:`,
      error
    );
  }
};

// Función para suscribirse a un tipo de mensaje (Simplificada)
export const subscribeMenssage = (
  type: EventFlowTypes,
  callback: MessageCallback
): (() => void) => {
  initialize(); // Asegura que el listener esté activo
  if (!subscriptions.has(type)) {
    subscriptions.set(type, new Set());
  }
  const callbacks = subscriptions.get(type)!;

  callbacks.add(callback); // Añadimos el callback directamente
  console.debug(`[MessagingService] Suscripción añadida para tipo: ${type}`);

  // Devuelve una función de desuscripción para limpieza
  return () => {
    unsubscribeMessage(type, callback);
  };
};

// Función explícita para desuscribirse (Simplificada)
export const unsubscribeMessage = (
  type: EventFlowTypes,
  callback: MessageCallback
): void => {
  const callbacks = subscriptions.get(type);
  if (callbacks) {
    callbacks.delete(callback); // Eliminamos el callback directamente
    console.debug(
      `[MessagingService] Suscripción eliminada para tipo: ${type}`
    );
    if (callbacks.size === 0) {
      subscriptions.delete(type);
    }
  }
};

// Opcional: Limpieza global si la app se desmonta completamente (raro en iframes)
// export const cleanup = (): void => {
//   if (isInitialized) {
//     window.removeEventListener('message', handleIncomingMessage);
//     subscriptions.clear();
//     isInitialized = false;
//     console.log('[MessagingService] Listener y suscripciones limpiadas.');
//   }
// };

// Inicializa automáticamente al importar el módulo
// initialize(); // Puedes optar por inicializar aquí o explícitamente en tu app principal

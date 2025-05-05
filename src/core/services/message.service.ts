import environments from "../../environments/environments";
import { CrossAppMessage, TypeEventCrossApp } from "../types/message";

// --- Tipos Internos ---
export type MessageCallback<T = any> = (payload: T | undefined) => void;
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
  if (!environments.targetHost.some((host) => !event.origin.includes(host))) {
    console.warn(`Mensaje ignorado de origen no confiable: ${event.origin}`);
    return;
  }

  // 2. Validar estructura básica del mensaje
  const message = event.data as CrossAppMessage;
  if (
    typeof message !== "object" ||
    message === null ||
    typeof message.type !== "string"
  ) {
    console.warn("Mensaje ignorado: formato inválido.", message);
    return;
  }

  console.debug(
    `[MessagingService] Mensaje recibido: Tipo=${message.type}`,
    message.payload
  );

  // 3. Notificar a los suscriptores
  const callbacks = subscriptions.get(message.type);
  if (callbacks) {
    callbacks.forEach((callback) => {
      try {
        callback(message.payload);
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
    // sendMessage('REACT_APP_READY');
  }
};

// Función para enviar mensajes a Angular
export const sendMessage = <T>(type: TypeEventCrossApp, payload?: T): void => {
  if (!window.parent || window.parent === window) {
    console.error(
      "[MessagingService] No se puede enviar mensaje: No se detecta un contenedor padre (iframe)."
    );
    return;
  }
  const message: CrossAppMessage<T> = { type, payload };
  console.debug(`[MessagingService] Enviando mensaje: Tipo=${type}`, payload);
  try {
    console.log(environments.targetHost);
    environments.targetHost.forEach((host) => {
      window.top.postMessage(message, host);
    });
  } catch (error) {
    console.error(
      `[MessagingService] Error al enviar mensaje tipo ${type}:`,
      error
    );
  }
};

// Función para suscribirse a un tipo de mensaje
export const subscribeMenssage = <T>(
  type: TypeEventCrossApp,
  callback: MessageCallback<T>
): (() => void) => {
  initialize(); // Asegura que el listener esté activo
  if (!subscriptions.has(type)) {
    subscriptions.set(type, new Set());
  }
  const callbacks = subscriptions.get(type);
  callbacks?.add(callback);
  console.debug(`[MessagingService] Suscripción añadida para tipo: ${type}`);

  // Devuelve una función de desuscripción para limpieza
  return () => {
    unsubscribeMessage(type, callback);
  };
};

// Opcional: Función explícita para desuscribirse (aunque devolverla en subscribe es más idiomático para hooks)
export const unsubscribeMessage = <T>(
  type: TypeEventCrossApp,
  callback: MessageCallback<T>
): void => {
  const callbacks = subscriptions.get(type);
  if (callbacks) {
    callbacks.delete(callback);
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

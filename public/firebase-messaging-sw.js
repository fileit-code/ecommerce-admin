importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Recibe configuración desde el frontend vía postMessage
self.addEventListener("message", (event) => {
  firebase.initializeApp(event.data);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(handleBackgroundMessage);
  
  const notificationTitle = payload.notification.title || 'Título por defecto';
  const notificationOptions = {
    body: payload.notification.body || 'Mensaje por defecto',
    icon: payload.notification.icon || '/icon.png',
    // Puedes agregar más opciones: click_action, image, etc.
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
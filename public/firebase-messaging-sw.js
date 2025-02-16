importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Recibe configuración desde el frontend vía postMessage
self.addEventListener("message", (event) => {
  firebase.initializeApp(event.data);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(handleBackgroundMessage);
});
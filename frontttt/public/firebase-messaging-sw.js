// Firebase Cloud Messaging Service Worker
/* eslint-disable no-undef */
/* global firebase, self, clients */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCoo1ze4V56CvJ61rHVU2Vp06fq8pVthug",
  authDomain: "bakery-19857.firebaseapp.com",
  projectId: "bakery-19857",
  storageBucket: "bakery-19857.firebasestorage.app",
  messagingSenderId: "952699473780",
  appId: "1:952699473780:web:962d284fff515c38a06621",
  measurementId: "G-HVR4QFXNFQ"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  
  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification.body || 'You have a new message',
      icon: payload.notification.icon || '/cake-icon.png',
      badge: '/cake-badge.png',
      tag: 'bakery-notification',
      requireInteraction: false,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  
  console.log('Firebase Messaging initialized in service worker');
} catch (error) {
  console.error('Error initializing Firebase in service worker:', error);
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  // Open the app or a specific page
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

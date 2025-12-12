const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let adminInitialized = false;

try {
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
  
  // Check if serviceAccountKey.json exists
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    adminInitialized = true;
    console.log('✅ Firebase Admin SDK initialized with service account key');
  } else {
    console.warn('⚠️ serviceAccountKey.json not found - Firebase Admin SDK not initialized');
    console.warn('⚠️ Background notifications (FCM) will not work, but foreground notifications (polling) will work');
  }
} catch (error) {
  console.warn('⚠️ Error initializing Firebase Admin SDK:', error.message);
  console.warn('⚠️ Firebase Admin SDK disabled - foreground notifications will still work via polling');
}

module.exports = { admin, adminInitialized };
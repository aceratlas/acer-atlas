
// Firebase Authentication and account-plan profile. Personal collection and photos stay local.
const acerFirebaseConfig = { apiKey: "AIzaSyA7rngg93Gt37SeTMnad6NyKvxtTB934as", authDomain: "acer-atlas.firebaseapp.com", projectId: "acer-atlas", storageBucket: "acer-atlas.firebasestorage.app", messagingSenderId: "236357012316", appId: "1:236357012316:web:0e67b44a2a6df01e34cf99" };
let acerAuth = null, acerDb = null;
try { if (window.firebase && !firebase.apps.length) firebase.initializeApp(acerFirebaseConfig); if(window.firebase) { acerAuth=firebase.auth(); acerDb=firebase.firestore(); } } catch(e) { console.error('Firebase initialisatie mislukt',e); }

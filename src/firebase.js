
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, update, remove } = require ('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBk0gR7H8OvIsav7s0CXOuntrghlZZiTjU",
  authDomain: "izp1-4b18d.firebaseapp.com",
  databaseURL: "https://izp1-4b18d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "izp1-4b18d",
  storageBucket: "izp1-4b18d.appspot.com",
  messagingSenderId: "796283843483",
  appId: "1:796283843483:web:3ec86f57153175ddd3e73e"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

async function getData(path) {
  return await get(child(dbRef, path)).then(data => data.exists() ? data.val() : '');
}
  
async function setData(updates) {
  return await update(dbRef, updates).then(() => true);
}

async function removeData(path) {
  const databaseRef = ref(getDatabase(app), path);
  return await remove(databaseRef).then(() => true);
}

module.exports = { getData, setData, removeData };
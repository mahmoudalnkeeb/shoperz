require('dotenv').config();
const { ref, getDownloadURL, getStorage, uploadBytesResumable, deleteObject } = require('firebase/storage');
const { app, firebaseConfig } = require('../configs/firebase.config');

async function uploadFile(file, folder) {
  let storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
  let filePath = `${folder}/${file.originalname}`;
  let storageRef = ref(storage, filePath);
  let metadata = {
    contentType: file.mimetype,
  };
  try {
    let uploadedFile = await uploadBytesResumable(storageRef, file.buffer, metadata);
    let url = await getDownloadURL(uploadedFile.ref);
    return { url, filePath };
  } catch (error) {
    throw new Error('error in uploading file to firebase storage', { cause: error });
  }
}

async function deleteFile(file) {
  let storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
  let storageRef = ref(storage, file);
  try {
    await deleteObject(storageRef);
    console.log('File deleted successfully');
  } catch (error) {
    throw new Error('Error deleting file from Firebase Storage', { cause: error });
  }
}

module.exports = { uploadFile, deleteFile };

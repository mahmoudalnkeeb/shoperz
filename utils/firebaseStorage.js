require('dotenv').config();
const { ref, getDownloadURL, getStorage, uploadBytesResumable } = require('firebase/storage');
const { app, firebaseConfig } = require('../configs/firebase.config');

const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

async function uploadFile(file, folder) {
  let storageRef = ref(storage, `${folder}/${file.originalname}`);
  let metadata = {
    contentType: file.mimetype,
  };
  try {
    let uploadedFile = await uploadBytesResumable(storageRef, file.buffer, metadata);
    let url = await getDownloadURL(uploadedFile.ref);
    return url;
  } catch (error) {
    throw new Error('error in uploading file to firebase storage', { cause: error });
  }
}

async function deleteFile(file) {}
module.exports = uploadFile;

/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { auth, db } from './firebase.js';

// observador usuario con sesion activa
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid, 'usuario activo');
  } else {
    console.log('no hay usuario activo');
  }
});

// formulario de registro
export async function registerUser(auth, email, password) {
  try {
    const register = await createUserWithEmailAndPassword(auth, email, password);
    return register;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Email is already in use');
    } else if (error.code === 'auth/invalid-email') {
      alert('Invalid email please try again');
    } else if (error.code === 'auth/weak-password') {
      alert('Password is too weak, it should contain at least 6 characters');
    }
    throw error; // línea lanza la excepción
  }
}

// agregar display name al registro
export async function addDisplayName(name) {
  const user = auth.currentUser;
  try {
    await updateProfile(user, { displayName: name });
    console.log('Nombre de usuario agregado correctamente');
  } catch (error) {
    console.log('Error al agregar el nombre del usuario:', error);
  }
}

// inicio sesión con email y contraseña

export function logIn(email, password) {
  const promise = signInWithEmailAndPassword(auth, email, password);
  return promise.then((credentials) => {
    const user = credentials.user;
    const displayName = user.displayName;
    return displayName;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);

    throw errorCode;
  });
}

// inicio sesión con google
export async function registerWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider);
    return credentials.user;
  } catch (error) {
    return error;
  }
}

// cerrar sesión
export async function logOut() {
  try {
    const out = await signOut(auth);
    return out;
  } catch (error) {
    return error;
  }
}

// agregar los post al muro
export async function postBoard(description) {
  try {
    const user = auth.currentUser;
    console.log(user.email, 'email del usuario');
    const docRef = await addDoc(collection(db, 'postDescription'), {
      description,
      email: user.email,
      userUid: user.uid,
      likes: [],
    });
    console.log(docRef);
  } catch (error) {
    // console.log(error);
  }
}

// eliminar post
export async function deletePost(id) {
  try {
    await deleteDoc(doc(db, 'postDescription', id));
  } catch (error) {
    console.log(error);
  }
}

// traer los post en tiempo real
export function onGetPost(callback) {
  onSnapshot(collection(db, 'postDescription'), callback);
}

// obtener un post de la colección
export async function getPost(id) {
  try {
    const getDocPost = await getDoc(doc(db, 'postDescription', id));
    return getDocPost;
  } catch (error) {
    return error;
  }
}

// actualizar los post luego de editarlos
export const updateAll = (id, newFields) => updateDoc(doc(db, 'postDescription', id), newFields);

// export async function validationEmail() {
//   try {
//     const verificationEmail = sendEmailVerification(auth.currentUser);
//     console.log(verificationEmail);
//   } catch (error) {
//     console.log(error);
//   }
// }

// Email verification sent!
// ...

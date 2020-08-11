import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp({
    // this is not a private key — all safe to be public
    apiKey: 'AIzaSyDnyogHUy4vdLY1vk9HHXjwKcVsd3rQDHU',
    authDomain: 'corgi-photo.firebaseapp.com',
    databaseURL: 'https://corgi-photo.firebaseio.com',
    projectId: 'corgi-photo',
    storageBucket: 'corgi-photo.appspot.com',
    messagingSenderId: '116095273122',
    appId: '1:116095273122:web:2a20db9099e5458ecfaffb',
    measurementId: 'G-T3S6Z63LS9',
  });
}

const auth = firebase.auth();
const db = firebase.firestore();
const corgisCol = db.collection('corgis');

export function signIn() {
  auth.signInAnonymously();
}

export function signOut() {
  auth.signOut();
}

export async function addCorgi(corgiUrl) {
  const user = auth.currentUser;

  try {
    await corgisCol.add({
      url: corgiUrl,
      uid: user.uid,
      createdAt: new Date(),
    });
  } catch (e) {
    alert(e.message);
  }
}

export function useCurrentUser() {
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    return auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  return user;
}

export function useCorgis() {
  const [corgis, setCorgis] = React.useState(null);
  useEffect(() => {
    return corgisCol
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const allCorgis = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredCorgis = allCorgis.filter(
          (corgi) =>
            corgi.url &&
            (corgi.url.startsWith('https://images.unsplash.com') ||
              corgi.url.startsWith(
                'https://firebasestorage.googleapis.com/v0/b/corgi-photo.appspot.com'
              ))
        );
        const mostRecentCorgis = filteredCorgis.slice(0, 20);
        setCorgis(mostRecentCorgis);
      });
  }, []);

  return corgis;
}

export async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  // should use uuid pkg but easier to not have to install something when walking through things
  const sillyId = new Date().getTime().toString() + Math.random().toString();
  const ref = firebase.storage().ref().child(sillyId);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

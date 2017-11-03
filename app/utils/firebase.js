// @flow

import firebase from 'firebase';

// Prod
const prodConfig = {
  apiKey: 'AIzaSyAvvcW5IGOzi2E0ZH_iS5OZHy4fHXSJ4aU',
  authDomain: 'steventrivia.firebaseapp.com',
  databaseURL: 'https://steventrivia.firebaseio.com',
  projectId: 'steventrivia',
  storageBucket: 'steventrivia.appspot.com',
  messagingSenderId: '793181201',
};

// E2E Tests
const e2eConfig = {
  apiKey: 'AIzaSyCXoyazhR7gJcyapC3vb8Hbj6rVtlPcJ1Q',
  authDomain: 'trivia-e2e-test.firebaseapp.com',
  databaseURL: 'https://trivia-e2e-test.firebaseio.com',
  projectId: 'trivia-e2e-test',
  storageBucket: '',
  messagingSenderId: '373151645209',
};

const TEST = 'test';

export default firebase.initializeApp(process.env.NODE_ENV === TEST ? e2eConfig : prodConfig);
const db = firebase.database();

export function loadData(data: Object) {
  const rootRef = firebase.database().ref();
  return rootRef.set(data);
}

export function createGame(gameID: string) {
  const rootRef = firebase.database().ref();
  // return rootRef.child('games').child(gameID).set({ status: 'inactive' }, callback);
  return new Promise((resolve: Function, reject: Function) => {
    checkIfGameExists(gameID)
    .then(({ gameExists }) => {
      if (gameExists) {
        reject({
          error: true,
          message: 'Game already exists',
        });
      } else {
        rootRef.child('games').child(gameID).set({ status: 'inactive' }, resolve);
      }
    });
        //  window.onload = resolve;
  });
}

export function checkIfGameExists(gameID: string) {
  return db.ref()
  .child('games')
  .child(gameID)
  .once('value')
  .then((dataSnapshot) => Promise.resolve({
    gameExists: dataSnapshot.exists(),
  }));
}

export function someFunction() {
  console.log('hello');
}

export function readSomething() {
  const messagesRef = firebase.database().ref('messages').once('value');
  return messagesRef.then((dataSnapshot) =>
    // console.log('Messages: ', dataSnapshot.val());
     dataSnapshot.val());
}

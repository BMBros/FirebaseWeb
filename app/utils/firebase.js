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

type CreateGameFullfilled = {
  gameID: string
}

type CreateGameHelperFullfilled = {
  data: ?Object
}
type CreateGameHelperRejected = {
  message: string,
}

type CheckIfExists = {
  gameExists: boolean
}

/**
 * Creates a game with a random character code.
 * If there is collision on an existing game, new character code is given
 */
export function createGame(gameID: string = generateGameID()): Promise<CreateGameFullfilled | CreateGameHelperRejected> {
  return createGameHelper(gameID).then(() => ({
    gameID,
  }), () => {
    console.warn(`Game ID ${gameID} didn't work, try again with another ID`);
    return createGame();
  });
}

/**
 * Attempts to create the initial game state for a game with the given ID.
 * If it is created the promise will resolve.
 * If the game already exists it will reject.
 */
export function createGameHelper(gameID: string): Promise<CreateGameHelperFullfilled | CreateGameHelperRejected> {
  const rootRef = firebase.database().ref();
  return new Promise((resolve: (CreateGameHelperFullfilled) => void, reject: (CreateGameHelperRejected) => void) => {
    checkIfGameExists(gameID)
    .then(({ gameExists }) => {
      if (gameExists) {
        reject({
          message: 'Game already exists',
        });
      } else {
        rootRef.child('games').child(gameID).set({ status: 'inactive' }, (callbackResponse) => {
          resolve({
            data: callbackResponse,
          });
        });
      }
    });
  });
}

export function generateGameID(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';

  for (let i = 0; i < 5; i += 1) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
}

/**
 * Checks if /games/<gameID> already exists
 */
export function checkIfGameExists(gameID: string): Promise<CheckIfExists> {
  return db.ref()
  .child('games')
  .child(gameID)
  .once('value')
  .then((dataSnapshot) => Promise.resolve({
    gameExists: dataSnapshot.exists(),
  }));
}

export function readSomething() {
  const messagesRef = firebase.database().ref('messages').once('value');
  return messagesRef.then((dataSnapshot) =>
    // console.log('Messages: ', dataSnapshot.val());
     dataSnapshot.val());
}

// @flow

import firebase from 'firebase';

import type {
  Question,
  Game,
 } from '../types/FirebaseTypes';

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

type CheckIfExists = {
  keyExists: boolean
}

type ThenableReference = Promise<void | null>;

/**
 * Creates a game with a random character code.
 * If there is collision on an existing game, new character code is given
 */
export function createGame(gameState: Game, gameID: string = generateGameID()): Promise<CreateGameFullfilled> {
  return createGameHelper(gameState, gameID).then(() => ({
    gameID,
  }), () => {
    console.warn(`Game ID ${gameID} didn't work, try again with another ID`);
    return createGame(gameState);
  });
}

/**
 * Attempts to create the initial game state for a game with the given ID.
 * If it is created the promise will resolve.
 * If the game already exists it will reject.
 */
export function createGameHelper(gameState: Game, gameID: string): ThenableReference {
  const rootRef = firebase.database().ref();
  return new Promise((resolve, reject) => {
    checkIfGameExists(gameID)
    .then(({ keyExists }) => {
      if (keyExists) {
        // Game already exists
        reject({
          message: 'Game already exists',
        });
      } else {
        rootRef.child('games').child(gameID).set(gameState, resolve);
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
    keyExists: dataSnapshot.exists(),
  }));
}

export function checkIfPlayerExists(playerKey: string): Promise<CheckIfExists> {
  return db.ref()
  .child('players')
  .child(playerKey)
  .once('value')
  .then((dataSnapshot) => Promise.resolve({
    keyExists: dataSnapshot.exists(),
  }));
}

export function joinGame(gameID: string, playerName: string, playerKey?: string) {
  checkIfGameExists(gameID).then(({ keyExists }) => {
    if (keyExists) {
      // Error to user that invalid game
    } else if (playerKey) {
      checkIfPlayerExists(playerKey).then((playerExists) => {
        if (playerExists.keyExists) {
          // reuse player
        } else {
          // create player
        }
      });
    } else {
      // create player
    }
  });
}

export function listenForPlayers() {
  // TODO
}

export function markIncorrectAnswerAsCorrect() {
  // TODO
}

export function createQuestion(question: Question): ThenableReference {
  return new Promise((resolve) => {
    db.ref().child('questions').push(question, resolve);
  });
}

export function getQuestion(questionKey: string) {
  return db.ref('questions').child(questionKey).once('value').then((dataSnapshot) => dataSnapshot.val());
}

export function getGame(gameKey: string) {
  return db.ref('games').child(gameKey).once('value').then((dataSnapshot) => dataSnapshot.val());
}

// export function advanceGameRound(gameID: string) {
//   // TODO
// }
//
// export function getScore(gameID: string) {
//   // TODO
// }
//
// export function answerQuestion(gameID: string, playerKey: string, questionID: string, answer: string) {
//   // TODO
// }

export function readSomething() {
  const messagesRef = firebase.database().ref('messages').once('value');
  return messagesRef.then((dataSnapshot) =>
    // console.log('Messages: ', dataSnapshot.val());
     dataSnapshot.val());
}

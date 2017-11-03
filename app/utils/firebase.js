// @flow

import firebase from 'firebase';
import moment from 'moment';

import type {
  Question,
  Game,
  Player,
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

export async function loadData(data: Object) {
  const rootRef = firebase.database().ref();
  await rootRef.set(data);
}

type CheckIfExists = {
  keyExists: boolean
}

type ThenableWithKey = Promise<{ key: string }>;

/**
 * Creates a game with a random character code.
 * If there is collision on an existing game, new character code is given
 */
export async function createGame(gameState: Game, gameKey: string = generateGameID()): ThenableWithKey {
  try {
    return await createGameHelper(gameState, gameKey);
  } catch (error) {
    console.warn(`Game ID ${gameKey} didn't work, try again with another ID`);
    return createGame(gameState);
  }
}

/**
 * Attempts to create the initial game state for a game with the given ID.
 * If it is created the promise will resolve.
 * If the game already exists it will reject.
 */
export async function createGameHelper(gameState: Game, gameKey: string): ThenableWithKey {
  const rootRef = firebase.database().ref();

  const { keyExists } = await checkIfGameExists(gameKey);
  if (keyExists) {
    throw new Error('Game already exists');
  } else {
    rootRef.child('games').child(gameKey).set(gameState);
  }
  return { key: gameKey };
}

export function generateGameID(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';

  for (let i = 0; i < 5; i += 1) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
}

/**
 * Checks if /games/<gameKey> already exists
 */
export async function checkIfGameExists(gameKey: string): Promise<CheckIfExists> {
  const game = await db.ref()
  .child('games')
  .child(gameKey)
  .once('value');

  return {
    keyExists: game.exists(),
  };
}

export async function createPlayer(player: Player): ThenableWithKey {
  const playerRef = db.ref('players').push();
  const key = (playerRef: any).key;
  await playerRef.set(player);
  return { key };
}

export async function checkIfPlayerExists(playerKey: string): Promise<CheckIfExists> {
  const player = await db.ref()
  .child('players')
  .child(playerKey)
  .once('value');
  return {
    keyExists: player.exists(),
  };
}

export async function addPlayerToGame(gameKey: string, playerKey: string) {
  await Promise.all([
    db.ref('players').child(playerKey).child('mostRecentGame').set(gameKey),
    db.ref('games').child(gameKey).child('players').child(playerKey).set({
      isConnected: true,
      lastHealthCheck: moment().format(),
    }),
  ]);
}

/**
 * Allows player to join an existing game.
 * If game does not exist an error will be thrown.
 * If player key is not passed, or if player key doesn't exist, a new player will be created.
 * Returns key of player that has joind the game
 */
export async function joinGame(gameKey: string, playerName: string, playerKey?: string): ThenableWithKey {
  const game = await checkIfGameExists(gameKey);
  if (!game.keyExists) {
    throw new Error('Game does not exist');
  }
  let playerKeyToUse;
  if (playerKey) {
    const player = await checkIfPlayerExists(playerKey);
    if (player.keyExists) {
      playerKeyToUse = playerKey;
    }
  }
  if (!playerKeyToUse) {
    const newPlayer = await createPlayer({
      name: playerName,
    });
    playerKeyToUse = newPlayer.key;
  }

  await addPlayerToGame(gameKey, playerKeyToUse);

  return {
    key: playerKeyToUse,
  };
}

// export function onPlayerJoined(gameKey: string) {
//   // TODO
//   db.ref('games').child(gameKey).child('players');
// }

export function markIncorrectAnswerAsCorrect() {
  // TODO
}

export async function createQuestion(question: Question): ThenableWithKey {
  const questionRef = await db.ref('questions').push();
  const key = (questionRef: any).key;
  await questionRef.set(question);
  return { key };
}

export async function getQuestion(questionKey: string): Promise<Question> {
  const question = await db.ref('questions').child(questionKey).once('value');
  return question.val();
}
export async function getGame(gameKey: string): Promise<Game> {
  const game = await db.ref('games').child(gameKey).once('value');
  return game.val();
}
export async function getPlayer(playerKey: string): Promise<Player> {
  const player = await db.ref('players').child(playerKey).once('value');
  return player.val();
}

export async function advanceGameRound(gameKey: string) {
  // TODO Should we add an option to not do this if people still submitting?
  const game = await getGame(gameKey);
  await db.ref('games').child(gameKey).child('currentQuestionIndex').set(game.currentQuestionIndex + 1);
}

export async function startGame(gameKey: string) {
  // TODO Should we add an option to not do this if people still submitting?
  const game = await getGame(gameKey);
  const isLobby = game.status === 'LOBBY';
  if (!isLobby) {
    throw new Error('Can only start game from the lobby');
  }
  await Promise.all([
    db.ref('games').child(gameKey).child('status').set('IN-PROGRESS'),
    advanceGameRound(gameKey),
  ]);
}


// export function getScore(gameKey: string) {
//   // TODO
// }
//
// export function answerQuestion(gameKey: string, playerKey: string, questionID: string, answer: string) {
//   // TODO
// }

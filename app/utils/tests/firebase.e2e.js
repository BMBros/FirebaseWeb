// @flow


// import { MockFirebase } from 'firebase-mock';
import firebase, {
  // someFunction,
  // readSomething,
  // clear,
  loadData,
  createGameHelper,
  checkIfGameExists,
  generateGameID,
  createGame,
} from '../firebase';

import {
  noGames,
  oneGame,
} from './firebaseData/data';

describe('firebase', () => {
  beforeAll((done) => {
    // Prime Firebase connection so first test doesn't time out
    firebase.database().ref().once('value').then(() => {
      done();
    });
  });
  describe('generateGameID', () => {
    it('should create a random game ID of length 5', () => {
      expect(generateGameID()).toBeTruthy();
      expect(generateGameID().length).toBe(5);
    });
  });
  describe('no games present', () => {
    beforeEach((done) => {
      // loadData(empty).then(() => {
      loadData(noGames).then(() => {
        done();
      });
    });
    it('checkIfGameExists should be false', (done) => {
      checkIfGameExists('1234').then((resolve) => {
        expect(resolve.gameExists).toBe(false);
        done();
      }, (reject) => {
        console.warn('Error: ', reject);
      });
    });
    it('createGameHelper should create game', (done) => {
      createGameHelper('1234').then(() => {
        done();
      });
    });
    it('should create game in Firebase with random game ID', (done) => {
      createGame().then(() => {
        done();
      });
    });
  });
  describe('games present', () => {
    beforeEach((done) => {
      loadData(oneGame).then(() => {
        expect('Game to resolve rather than reject').toBeTruthy();
        done();
      });
    });
    it('checkIfGameExists should be true', (done) => {
      checkIfGameExists('1234').then((result) => {
        expect(result.gameExists).toBe(true);
        done();
      });
    });
    it('createGameHelper should not create game with same ID when it already exists', (done) => {
      createGameHelper('1234').then(() => {
      }, () => {
        // If rejected, we're good
        done();
      });
    });
    it('createGameHelper should be able to create game with different ID ', (done) => {
      createGameHelper('5342').then(() => {
        done();
      });
    });
    it.only('creageGame should retry if existing game ID is taken', (done) => {
      console.warn = jest.fn();
      expect(console.warn).not.toHaveBeenCalled();
      createGame('1234').then((resolution) => {
        console.log('Resolution: ', resolution);
        // Warning is logged when the method tries to repeat itself to make a new id
        expect(console.warn).toHaveBeenCalled();
        done();
      });
    });
  });
  // describe('someFunction', () => {
  //   it('should do something', () => {
  //     // someFunction();
  //   });
  // });
});

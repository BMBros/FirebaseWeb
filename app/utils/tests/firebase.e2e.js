// import { MockFirebase } from 'firebase-mock';
import {
  // someFunction,
  // readSomething,
  // clear,
  loadData,
  createGame,
  checkIfGameExists,
} from '../firebase';

import {
  noGames,
  oneGame,
} from './firebaseData/data';

describe('firebase', () => {
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
    it('createGame should create game', (done) => {
      createGame('1234').then(() => {
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
    it('createGame should not create game with same ID when it already exists', (done) => {
      createGame('1234').then(() => {
      }, (reject) => {
        expect(reject.error).toBe(true);
        done(reject);
      });
    });
    it('createGame should be able to create game with different ID ', (done) => {
      createGame('5342').then(() => {
        done();
      });
    });
  });
  describe('someFunction', () => {
    it('should do something', () => {
      // someFunction();
    });
  });
});

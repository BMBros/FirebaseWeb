// @flow

import firebase, {
  loadData,
  createGameHelper,
  checkIfGameExists,
  generateGameID,
  createGame,
  createQuestion,
  getQuestion,
  joinGame,
  createPlayer,
} from '../firebase';

import {
  noGames,
  oneGame,
  questions,
  empty,
} from './firebaseData/data';

describe('firebase', () => {
  beforeAll((done) => {
    // Prime Firebase connection so first test doesn't time out
    firebase.database().ref().once('value').then(() => {
      done();
    });
  }, 10000);
  describe('create player', () => {
    beforeEach((done) => {
      loadData(empty).then(() => {
        expect('Game to resolve rather than reject').toBeTruthy();
        done();
      });
    });

    it('should create a player and supply the key', (done) => {
      createPlayer({
        name: 'Steven',
      }).then((response) => {
        expect(response.key).toBeDefined();
        done();
      });
    });
  });

  describe('join game', () => {
    beforeEach((done) => {
      loadData(oneGame).then(() => {
        expect('Game to resolve rather than reject').toBeTruthy();
        done();
      });
    });
    it('should not let player join non-existant game', (done) => {
      joinGame('FAKE_KEY', 'Steven').then(() => {
      }, (reject) => {
        expect(reject.message).toBe('Game does not exist');
        done();
      });
    });
    it('should not let fake player join real game', (done) => {
      joinGame('1234', 'Steven', 'Fake Player').then(() => {
      }, (reject) => {
        expect(reject.message).toBe('Player does not exist');
        done();
      });
    });
  });
  describe('questions', () => {
    beforeEach((done) => {
      loadData(questions).then(() => {
        done();
      });
    });
    it('should create a question', (done) => {
      createQuestion({
        question: 'What color is mario?',
        answer: 'red',
      }).then(() => {
        done();
      });
    });
    it('should read a question', (done) => {
      getQuestion('-Ky237LlqjKRQ1WdxhIr').then((data) => {
        expect(data).toEqual({
          answer: 'red',
          question: 'What color is mario?',
        });
        done();
      });
    });
  });
  describe('generateGameID', () => {
    it('should create a random game ID of length 5', () => {
      expect(generateGameID()).toBeTruthy();
      expect(generateGameID().length).toBe(5);
    });
  });
  describe('games', () => {
    const initalGameState = {
      questionnaire: 'FAKE_KEY',
      status: 'LOBBY',
      currentQuestionIndex: 0,
      totalQuestions: 0,
      players: {},
      hasSubmitted: {},
    };
    describe('no games present', () => {
      beforeEach((done) => {
      // loadData(empty).then(() => {
        loadData(noGames).then(() => {
          done();
        });
      });
      it('checkIfGameExists should be false', (done) => {
        checkIfGameExists('1234').then((resolve) => {
          expect(resolve.keyExists).toBe(false);
          done();
        });
      });
      it('createGameHelper should create game', (done) => {
        createGameHelper(initalGameState, '1234').then(() => {
          done();
        });
      });
      it('creageGame should create game in Firebase with random game ID', async () => {
        const game = await createGame(initalGameState);
        expect(game.key).toBeDefined();
      });
    });
    describe('one game present', () => {
      beforeEach((done) => {
        loadData(oneGame).then(() => {
          expect('Game to resolve rather than reject').toBeTruthy();
          done();
        });
      });
      it('checkIfGameExists of proper ID should be true', (done) => {
        checkIfGameExists('1234').then((result) => {
          expect(result.keyExists).toBe(true);
          done();
        });
      });
      it('createGameHelper should not create game with same ID when it already exists', (done) => {
        createGameHelper(initalGameState, '1234').then(() => {
        }, () => {
        // If rejected, we're good
          done();
        });
      });
      it('createGameHelper should be able to create game with different ID ', (done) => {
        createGameHelper(initalGameState, '5342').then(() => {
          done();
        });
      });
      it('createGame should retry if existing game ID is taken', async () => {
        console.warn = jest.fn();
        expect(console.warn).not.toHaveBeenCalled();
        const success = await createGame(initalGameState, '1234');
        expect(success.key).toBeDefined();
        expect(console.warn).toHaveBeenCalled();
      });
    });
  });
});

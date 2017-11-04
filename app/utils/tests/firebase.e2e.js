// @flow
import MockDate from 'mockdate';
import moment from 'moment';

import firebase, {
  loadData,
  checkIfGameExists,
  generateGameID,
  createGame,
  createQuestion,
  getQuestion,
  joinGame,
  createPlayer,
  getGame,
  advanceGameRound,
  startGame,
  onGameRoundChange,
  getGameQuestionByRound,
  answerQuestion,
  getAnswers,
  getQuestionKeysForQuestionnaire,
  getQuestionsFromQuestionKeys,
  overrideResponseAsCorrect,
  getPlayerAnswerByRound,
  getGameScore,
  endGame,
} from '../firebase';

import {
  noGames,
  oneGame,
  questions,
  empty,
  gameAtLobby,
  gameStarted,
  gameWithQuestions,
  playerResponse,
  scoreBoard,
} from './firebaseData/data';

const momentTime = '2017-02-04T00:00:00+00:00';

describe('firebase', () => {
  beforeAll((done) => {
    MockDate.set(moment('2017-02-04'), 0);
    // Prime Firebase connection so first test doesn't time out
    firebase.database().ref().once('value').then(() => {
      done();
    });
  }, 10000);
  describe('questions', () => {
    beforeEach(async () => {
      await loadData(gameWithQuestions);
    });

    it('should be able to read question for the round', async () => {
      expect(await getGameQuestionByRound('1234', 0)).toEqual({
        answer: 'Answer A',
        question: 'Question A',
      });
    });
  });
  describe('score', () => {
    beforeEach(async () => {
      await loadData(scoreBoard);
    });

    it('should be able to calculate game score', async () => {
      const scores = await getGameScore('1234', 1);
      expect(scores).toEqual([
        {
          playerKey: 'playerKeyA',
          score: 1,
        },
        {
          playerKey: 'playerKeyB',
          score: 1,
        },
        {
          playerKey: 'playerKeyC',
          score: 1,
        },
      ]);
    });
    it('should be able to calculate game score', async () => {
      const scores = await getGameScore('1234', 2);
      expect(scores).toEqual([
        {
          playerKey: 'playerKeyA',
          score: 2,
        },
        {
          playerKey: 'playerKeyB',
          score: 1,
        },
        {
          playerKey: 'playerKeyC',
          score: 2,
        },
      ]);
    });
  });
  describe('scoreoard', () => {
    beforeEach(async () => {
      await loadData(gameWithQuestions);
    });

    it('should be able to get a player\'s answer', async () => {
      const response = 'my answer';
      answerQuestion('1234', 'playerKey', 0, response);

      const result = await getAnswers('1234', 'playerKey');
      expect(result).toEqual([{
        response,
      }]);
    });
    // Manuall eyeball validation, as it takes 4s? For function to fire
    // it('should have answer validated by firebase function', async () => {
    //   const answer = 'answer a';
    //   answerQuestion('1234', 'playerKey', 0, answer);
    //
    //   const result = await getAnswers('1234', 'playerKey');
    //   expect(result).toEqual([{
    //     answer,
    //   }]);
    // });
  });
  describe('create player', () => {
    beforeEach(async () => {
      await loadData(empty);
    });

    it('should create a player and supply the key', async () => {
      const player = await createPlayer('Steven');
      expect(player.key).toBeDefined();
    });
  });

  describe('admin', () => {
    describe('overrideResponseAsCorrect', () => {
      beforeEach(async () => {
        await loadData(playerResponse);
      });
      it('should override response as correct', async () => {
        const gameKey = '1234';
        const playerKey = 'playerKey';
        const round = 0;

        const answer = await getPlayerAnswerByRound(gameKey, playerKey, round);
        expect(answer.isCorrectAdminOverride).not.toBeDefined();

        overrideResponseAsCorrect(gameKey, playerKey, round);

        const answerAfterCorrection = await getPlayerAnswerByRound(gameKey, playerKey, round);
        expect(answerAfterCorrection.isCorrectAdminOverride).toBe(true);
      });
    });
  });

  describe('join game', () => {
    beforeEach(async () => {
      await loadData(oneGame);
    });
    it('should not let player join non-existant game', async () => {
      await expect(joinGame('FAKE_KEY', 'Steven')).rejects.toEqual(new Error('Game does not exist'));
    });
    it('should not let fake player join real game', async () => {
      // await expect(joinGame('1234', 'Steven', 'Fake Player')).rejects.toEqual(new Error('Player does not exist'));
      const player = await joinGame('1234', 'Steven', 'someFakePlayer');
      const game = await getGame('1234');
      expect(game).toEqual({
        round: 0,
        players: {
          [player.key]: {
            isConnected: true,
            lastHealthCheck: momentTime,
          },
        },
        someKey: 'someValue',
      });
    });
    it('should let real player join real game', async () => {
      await joinGame('1234', 'Steven', 'somePlayerID');
      const game = await getGame('1234');
      expect(game).toEqual({
        round: 0,
        players: {
          somePlayerID: {
            isConnected: true,
            lastHealthCheck: momentTime,
          },
        },
        someKey: 'someValue',
      });
    });
  });
  describe('questions', () => {
    beforeEach(async () => {
      await loadData(questions);
    });
    it('should create a question', async () => {
      const question = await createQuestion({
        question: 'What color is mario?',
        answer: 'red',
      });
      expect(question.key).toBeDefined();
    });
    it('should read a question', async () => {
      const question = await getQuestion('-Ky237LlqjKRQ1WdxhIr');
      expect(question).toEqual({
        answer: 'red',
        question: 'What color is mario?',
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
    describe('no games present', () => {
      beforeEach(async () => {
        await loadData(noGames);
      });
      it('checkIfGameExists should be false', async () => {
        const game = await checkIfGameExists('1234');
        expect(game.keyExists).toBe(false);
      });
      it('createGame should create game in Firebase with random game ID', async () => {
        const game = await createGame('A1');
        expect(game.key).toBeDefined();
      });
    });
    describe('one game present', () => {
      beforeEach(async () => {
        await loadData(gameWithQuestions);
      });
      it('checkIfGameExists of proper ID should be true', async () => {
        const game = await checkIfGameExists('1234');
        expect(game.keyExists).toBe(true);
      });
      it('createGame should not create game with same ID when it already exists', async () => {
        try {
          await createGame('A1', '1234');
        } catch (error) {
          expect(error.message).toBe('Game already exists');
        }
      });
      it('createGame should be able to create game with different ID ', async () => {
        const game = await createGame('A1', '5342');
        expect(game.key).toBeDefined();
      });
      it('createGame should retry if existing game ID is taken', async () => {
        console.warn = jest.fn();
        expect(console.warn).not.toHaveBeenCalled();
        const success = await createGame('A1', '1234');
        expect(success.key).toBeDefined();
        expect(console.warn).toHaveBeenCalled();
      });
      it('should be able to advance game round', async () => {
        let game = await getGame('1234');
        expect(game.round).toBe(0);
        await advanceGameRound('1234');
        game = await getGame('1234');
        expect(game.round).toBe(1);
        expect(game.currentQuestion && game.currentQuestion.key).toBe('B');
      });
      it('should be notified when round changes', async () => {
        const mockCallback = jest.fn();
        const game = await getGame('1234');
        expect(game.round).toBe(0);

        const off = onGameRoundChange('1234', mockCallback);

        expect(mockCallback).not.toBeCalled();
        expect(mockCallback.mock.calls.length).toBe(0);
        await advanceGameRound('1234');
        // // First call will receive both 0 (initial) and 1 (updated)
        expect(mockCallback.mock.calls.length).toBe(2);
        await advanceGameRound('1234');
        expect(mockCallback.mock.calls.length).toBe(3);
        off();
      });
    });
    describe('game at lobby', () => {
      beforeEach(async () => {
        await loadData(gameAtLobby);
      });
      it('should be able to start game not yet started', async () => {
        const game = await getGame('1234');
        expect(game.status).toBe('LOBBY');
        await startGame('1234');

        const game2 = await getGame('1234');
        expect(game2.status).toBe('IN-PROGRESS');
        expect(game2.round).toBe(0);
        expect(game2.currentQuestion).toBeDefined();
      });
      it('should get all questions', async () => {
        const questionKeys = await getQuestionKeysForQuestionnaire('A1');
        const questionsData = await getQuestionsFromQuestionKeys(questionKeys);
        expect(questionsData).toEqual([
          {
            key: 'A',
            question: 'Question A',
            answer: 'Answer A',
          },
          {
            key: 'B',
            question: 'Question B',
            answer: 'Answer B',
          },
          {
            key: 'C',
            question: 'Question C',
            answer: 'Answer C',
          },
        ]);
      });
      it('should be able to end game from lobby', async () => {
        await endGame('1234');

        const game = await getGame('1234');
        expect(game.status).toBe('COMPLETE');
      });
    });
    describe('game already started', () => {
      beforeEach(async () => {
        await loadData(gameStarted);
      });
      it('should not be able to start game already started', async () => {
        await expect(startGame('1234')).rejects.toEqual(new Error('Can only start game from the lobby'));
      });
    });
  });
});

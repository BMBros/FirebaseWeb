
export const empty = {
};
export const noGames = {
  games: {},
};
export const oneGame = {
  players: {
    somePlayerID: {
      name: 'Frank',
    },
  },
  games: {
    1234: {
      currentQuestionIndex: 0,
      someKey: 'someValue',
    },
  },
};
export const gameAtLobby = {
  games: {
    1234: {
      currentQuestionIndex: 0,
      status: 'LOBBY',
    },
  },
};
export const gameStarted = {
  games: {
    1234: {
      status: 'IN-PROGRESS',
    },
  },
};
export const questions = {
  questions: {
    '-Ky237LlqjKRQ1WdxhIr': {
      answer: 'red',
      question: 'What color is mario?',
    },
  },
};


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
export const gameWithQuestions = {
  games: {
    1234: {
      status: 'IN-PROGRESS',
      questionnaire: 'A1',
      currentQuestionIndex: 0,
    },
  },
  questionnaires: {
    A1: [
      'A',
      'B',
      'C',
      'D',
    ],
  },
  questions: {
    A: {
      question: 'Question A',
      answer: 'Answer A',
    },
    B: {
      question: 'Question B',
      answer: 'Answer B',
    },
    C: {
      question: 'Question C',
      answer: 'Answer C',
    },
    D: {
      question: 'Question D',
      answer: 'Answer D',
    },
  },
};

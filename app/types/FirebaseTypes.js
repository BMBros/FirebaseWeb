// @flow

type GameKey = string;
type QuestionaireKey = string;
type GameStatus = 'LOBBY' | 'IN-PROGRESS' | 'COMPLETE';
type PlayerKey = string;
type QuestionKey = string;

export type Player = {
  name: string,
  mostRecentGame: GameKey,
};

export type Game = {
  questionnaire: QuestionaireKey,
  status: GameStatus,
  currentQuestionIndex: number,
  totalQuestions: number,
  players: {
    [key: PlayerKey]: {
      isConnected: boolean,
      lastHealthCheck: number
    }
  },
  hasSubmitted: {
    [key: PlayerKey]: boolean
  },
}

export type Question = {
  question: string,
  answer: string,
  // type: 'MULTIPLE-CHOICE' | 'FREEHAND',
  options?: Array<string>,
  image?: string
}

export type Answer = {
  response: string,
  isCorrect?: boolean,
  adminOverrideAsCorrect?: boolean
}

export type ScoreBoard = {
  questionnairre: QuestionaireKey,
  roundsScored: number,
  scores: {
    [key: PlayerKey]: number
  },
  players: {
    [key: PlayerKey]: {
      answers: Array<Answer>
    }
  }
}

export type Questionairre = Array<QuestionKey>;

export type Scheme = {
  players: {
    [key: PlayerKey]: Player
  },
  games: {
    [key: GameKey]: Game
  },
  questionnaires: {
    [key: QuestionaireKey]: Questionairre
  },
  questions: {
    [key: QuestionKey]: Question
  },
  scoreBoard: {
    [key: GameKey]: ScoreBoard
  }
}

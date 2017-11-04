// @flow

type GameKey = string;
type QuestionnaireKey = string;
type GameStatus = 'LOBBY' | 'IN-PROGRESS' | 'COMPLETE';
type PlayerKey = string;
type QuestionKey = string;

export type Player = {
  name: string,
  mostRecentGame?: GameKey,
};

export type Game = {
  questionnaire: QuestionnaireKey,
  status: GameStatus,
  currentQuestionIndex?: number,
  currentQuestion?: Question,
  totalQuestions: number,
  players: {
    [key: PlayerKey]: {
      isConnected: boolean,
      lastHealthCheck: string // iso date
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
  questionnaire: QuestionnaireKey,
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

export type Questionnaire = Array<QuestionKey>;

export type Scheme = {
  players: {
    [key: PlayerKey]: Player
  },
  games: {
    [key: GameKey]: Game
  },
  questionnaires: {
    [key: QuestionnaireKey]: Questionnaire
  },
  questions: {
    [key: QuestionKey]: Question
  },
  scoreBoard: {
    [key: GameKey]: ScoreBoard
  }
}

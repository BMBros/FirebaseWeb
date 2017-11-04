// @flow

type GameKey = string;
type QuestionnaireKey = string;
type GameStatus = 'LOBBY' | 'IN-PROGRESS' | 'COMPLETE';
type PlayerKey = string;
type QuestionKey = string;

type QuestionsMap = { [key: QuestionKey]: Question };

export type PlayersAnswers = {
  [key: PlayerKey]: {
    answers: Array<Answer>
  }
}

export type Player = {
  name: string,
  mostRecentGame?: GameKey,
};

export type Game = {
  status: GameStatus,
  questionnaire: QuestionnaireKey,
  questions: Array<Question>,
  round?: number,
  currentQuestion?: Question,
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
  image?: string,
  key?: string,
  points: number
}

export type Answer = {
  response: string,
  isCorrect?: boolean,
  isCorrectAdminOverride?: boolean,
  originalQuestion?: Question
}

export type ScoreBoard = {
  questionnaire: QuestionnaireKey,
  roundsScored: number,
  scores: {
    [key: PlayerKey]: number
  },
  players: PlayersAnswers
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
  questions: QuestionsMap,
  scores: {
    [key: GameKey]: ScoreBoard
  }
}

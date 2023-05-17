import { IGameQuestion } from './IGameQuestion';

export interface IGameQuestionArray {
  questions: Array<IGameQuestion>;
  currentQuestion: number;
}

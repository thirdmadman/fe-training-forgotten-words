import { IGameAnswer } from './IGameAnswer';
import { IWord } from './IWord';

export interface IGameQuestion {
  wordData: IWord,
  variants: Array<IGameAnswer>,
}

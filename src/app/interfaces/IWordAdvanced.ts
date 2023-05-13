import { IUserWord } from './IUserWord';
import { IWord } from './IWord';

export interface IWordAdvanced {
  word: IWord;
  userData?: IUserWord;
}

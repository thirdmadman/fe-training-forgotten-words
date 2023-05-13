import { IUserWordOptional } from './IUserWordOptional';

export interface IUserWord {
  id: string;
  difficulty: string;
  optional: IUserWordOptional;
  wordId: string;
}

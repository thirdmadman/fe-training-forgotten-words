import { IAggregatedWord } from '../interfaces/IAggregatedWord';
import { IUserWord } from '../interfaces/IUserWord';
import { IWord } from '../interfaces/IWord';
import { IWordAdvanced } from '../interfaces/IWordAdvanced';

export function convertAggregatedWordToWordAdvanced(aggregatedWord: IAggregatedWord) {
  const parsedWord = Object.fromEntries(
    Object.entries(aggregatedWord).filter(([key]) => !(key.includes('userWord') || key.includes('_id'))),
  );
  // eslint-disable-next-line no-underscore-dangle
  parsedWord.id = aggregatedWord._id;
  const newParsedWord = parsedWord as IWord;
  const parsedUserWord = aggregatedWord.userWord ? ({ ...aggregatedWord.userWord } as IUserWord) : undefined;

  const wordAdvanced = {
    word: newParsedWord,
  } as IWordAdvanced;

  if (parsedUserWord) {
    parsedUserWord.id = '-1'; // potential bug creator, be warned!
    parsedUserWord.wordId = newParsedWord.id;
    wordAdvanced.userData = parsedUserWord;
  }
  return wordAdvanced;
}

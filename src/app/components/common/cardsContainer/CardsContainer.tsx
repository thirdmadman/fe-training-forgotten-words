import { useEffect, useState } from 'react';
import { IWord } from '../../../interfaces/IWord';
import { Card } from '../card/Card';
import { IPaginatedArray } from '../../../interfaces/IPaginatedArray';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { IWordAdvanced } from '../../../interfaces/IWordAdvanced';
import './CardsContainer.scss';
import { IAggregatedWord } from '../../../interfaces/IAggregatedWord';
import { convertAggregatedWordToWordAdvanced } from '../../../utils/convertAggregatedWordToWordAdvanced';

export interface CardsContainerProps {
  paginatedArrayOfIWord: IPaginatedArray<IWord> | null;
  paginatedArrayOfIAggregatedWord: IPaginatedArray<IAggregatedWord> | null;
}

export function CardsContainer(props: CardsContainerProps) {
  const { paginatedArrayOfIWord, paginatedArrayOfIAggregatedWord } = props;

  const [dataIWordAdvanced, setDataIWordAdvanced] = useState<Array<IWordAdvanced>>();

  useEffect(() => {
    if (paginatedArrayOfIWord) {
      const { array } = paginatedArrayOfIWord;
      const renderCards = () => {
        const userId = TokenProvider.getUserId();
        let advancedWords = array.map((word) => ({ word } as IWordAdvanced));
        if (userId && !TokenProvider.checkIsExpired()) {
          UserWordService.getAllWordsByUserId(userId)
            .then((userWordsData) => {
              advancedWords = array.map((word) => {
                if (userWordsData) {
                  const userWordFound = userWordsData.find((userWord) => userWord.wordId === word.id);
                  if (userWordFound) {
                    return {
                      word,
                      userData: userWordFound,
                    } as IWordAdvanced;
                  }
                }

                return {
                  word,
                } as IWordAdvanced;
              });

              setDataIWordAdvanced(advancedWords);
            })
            .catch((e) => console.error(e));
        } else {
          setDataIWordAdvanced(advancedWords);
        }
      };
      renderCards();
    }

    if (paginatedArrayOfIAggregatedWord) {
      const { array } = paginatedArrayOfIAggregatedWord;
      const convertedWords = array.map(convertAggregatedWordToWordAdvanced);
      setDataIWordAdvanced(convertedWords);
    }
  }, [paginatedArrayOfIWord, paginatedArrayOfIAggregatedWord]);

  return (
    <div className="cards-container">
      {dataIWordAdvanced && dataIWordAdvanced.map((word) => <Card wordAdvanced={word} key={word.word.id} />)}
    </div>
  );
}

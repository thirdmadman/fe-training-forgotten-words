import { useEffect, useState } from 'react';
import { IWord } from '../../../../interfaces/IWord';
import { Card } from './card/Card';
import { IPaginatedArray } from '../../../../interfaces/IPaginatedArray';
import { TokenProvider } from '../../../../services/TokenProvider';
import { UserWordService } from '../../../../services/UserWordService';
import { IWordAdvanced } from '../../../../interfaces/IWordAdvanced';
import './CardsContainer.scss';

export interface CardsContainerProps {
  data: IPaginatedArray<IWord>;
}

export function CardsContainer(props: CardsContainerProps) {
  const { data } = props;

  const [dataIWordAdvanced, setDataIWordAdvanced] = useState<Array<IWordAdvanced>>();

  useEffect(() => {
    const renderCards = () => {
      const userId = TokenProvider.getUserId();
      let advancedWords = data.array.map((word) => ({ word } as IWordAdvanced));
      if (userId && !TokenProvider.checkIsExpired()) {
        UserWordService.getAllWordsByUserId(userId)
          .then((wordsData) => {
            advancedWords = data.array.map((word) => {
              const userWordFound = wordsData.find((userWord) => userWord.wordId === word.id);
              if (userWordFound) {
                return {
                  word,
                  userData: userWordFound,
                } as IWordAdvanced;
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
  }, [data]);

  return (
    <div className="cards-container">
      {dataIWordAdvanced && dataIWordAdvanced.map((word) => <Card wordAdvanced={word} key={word.word.id} />)}
    </div>
  );
}
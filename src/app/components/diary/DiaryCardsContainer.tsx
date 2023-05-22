import { IAggregatedWord } from '../../interfaces/IAggregatedWord';
import { IPaginatedArray } from '../../interfaces/IPaginatedArray';
import { convertAggregatedWordToWordAdvanced } from '../../utils/convertAggregatedWordToWordAdvanced';
import { Card } from '../common/card/Card';
import '../cardsContainer/CardsContainer.scss';

interface DiaryCardsContainerProps {
  wordsPaginatedArray: IPaginatedArray<IAggregatedWord>;
}

export function DiaryCardsContainer(props: DiaryCardsContainerProps) {
  const { wordsPaginatedArray } = props;
  const words = wordsPaginatedArray.array;

  const convertedWords = words.map(convertAggregatedWordToWordAdvanced);

  return (
    <div className="cards-container">
      {convertedWords && convertedWords.map((word) => <Card wordAdvanced={word} key={word.word.id} />)}
    </div>
  );
}

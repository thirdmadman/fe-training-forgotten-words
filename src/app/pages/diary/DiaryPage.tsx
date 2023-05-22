import { useEffect, useState } from 'react';
import { IAggregatedWord } from '../../interfaces/IAggregatedWord';
import { IPaginatedArray } from '../../interfaces/IPaginatedArray';
import { TokenProvider } from '../../services/TokenProvider';
import { UsersAggregatedWordsService } from '../../services/UsersAggregatedWordsService';

export function DiaryPage() {
  const [userDiaryWords, setUserDiaryWords] = useState<IPaginatedArray<IAggregatedWord> | null>(null);

  useEffect(() => {
    console.error('useEffect');
    const userId = TokenProvider.getUserId();
    if (userId && !TokenProvider.checkIsExpired()) {
      UsersAggregatedWordsService.getAggregatedWordsWithResults(userId, 0, 100)
        .then((userAggregatedWords) => setUserDiaryWords(userAggregatedWords))
        .catch((e) => console.error(e));
    }
  }, [setUserDiaryWords]);

  console.error(userDiaryWords);

  return <div className="diary-page">diary</div>;
}

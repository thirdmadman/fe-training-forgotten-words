import { createAsyncThunk } from '@reduxjs/toolkit';
import { IResultData } from '../../../interfaces/IResultData';
import { IUserWord } from '../../../interfaces/IUserWord';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { executePromisesSequentially } from '../../../utils/executePromisesSequentially';

interface GameResults {
  results: Array<IResultData>;
  answerChain: number;
}

const sendMiniGameStatistics = async (args: GameResults) => {
  const isExpired = TokenProvider.checkIsExpired();
  const userId = TokenProvider.getUserId();

  if (isExpired || !userId) {
    return false;
  }

  // eslint-disable-next-line arrow-body-style
  const promiseFunction = (item: IResultData) => {
    return () => UserWordService.setWordStatistic(userId, item.questionData.id, item.isCorrect);
  };

  const setWordStatisticPromises = args.results.map(promiseFunction);

  await executePromisesSequentially<IUserWord>(setWordStatisticPromises)
    .then()
    .catch((error) => {
      console.error('Error:', error);
    });

  return true;
};

export const sendMiniGameStatisticsAction = createAsyncThunk<boolean, GameResults>(
  'audiocall/sendMiniGameStatistics',
  sendMiniGameStatistics,
);

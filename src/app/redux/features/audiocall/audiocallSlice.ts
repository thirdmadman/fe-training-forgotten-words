import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameAnswer } from '../../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import { IGameQuestionArray } from '../../../interfaces/IGameQuestionArray';
import { IPaginatedArray } from '../../../interfaces/IPaginatedArray';
import { IResultData } from '../../../interfaces/IResultData';
import { IUserWord } from '../../../interfaces/IUserWord';
import { IWord } from '../../../interfaces/IWord';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { WordService } from '../../../services/WordService';
import { executePromisesSequentially } from '../../../utils/executePromisesSequentially';

interface AudiocallPageState {
  questions: IGameQuestionArray | undefined;
  results: Array<IResultData> | undefined;
  answerChain: number;
  level: number;
  page: number;
}

const initialState: AudiocallPageState = {
  questions: undefined,
  results: undefined,
  answerChain: 0,
  level: -1,
  page: -1,
};

const createVariantsForAnswer = (wordsArray: Array<IWord>, count: number, currentWord: IWord) => {
  const onlyDifferentWords = wordsArray.filter((word) => word.id !== currentWord.id);

  const shuffledAndCutArray = [...onlyDifferentWords].sort(() => Math.random() - 0.5).slice(0, count - 1);

  const incorrectVariants = shuffledAndCutArray.map((word) => {
    const newVariant = {
      wordData: word,
      isCorrect: false,
    };
    return newVariant as IGameAnswer;
  });

  const correctVariant = {
    wordData: currentWord,
    isCorrect: true,
  } as IGameAnswer;

  return incorrectVariants.concat(correctVariant).sort(() => Math.random() - 0.5);
};

const createQuestions = (wordsArray: Array<IWord>) => {
  const result = wordsArray.map((word) => {
    const newQuestion = {
      wordData: word,
      variants: createVariantsForAnswer(wordsArray, 4, word),
    };
    return newQuestion as IGameQuestion;
  });

  return result.sort(() => Math.random() - 0.5);
};

interface LevelAndPageArgs {
  level: number;
  page: number;
}

interface GameResults {
  results: Array<IResultData>;
  answerChain: number;
}

const getQuestions = async (args: LevelAndPageArgs) => WordService.getWordsByGroupAndPage(args.level, args.page);

export const getQuestionsAction = createAsyncThunk<IPaginatedArray<IWord>, LevelAndPageArgs>(
  'audiocall/getQuestions',
  getQuestions,
);

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

export const audiocallSlice = createSlice({
  name: 'audiocall',
  initialState,
  reducers: {
    setLevelAndPageAction: (state, action: PayloadAction<LevelAndPageArgs>) => {
      state.level = action.payload.level;
      state.page = action.payload.page;
    },
    setResultsAction: (state, action: PayloadAction<GameResults>) => {
      state.results = action.payload.results;
      state.answerChain = action.payload.answerChain;
    },
    setQuestionsAction: (state, action: PayloadAction<IGameQuestionArray>) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuestionsAction.fulfilled, (state, action) => {
      if (action.payload) {
        const questionsData = {
          questions: createQuestions(action.payload.array),
          currentQuestion: 0,
        } as IGameQuestionArray;
        state.questions = questionsData;
      }
    });
  },
});

export const { setLevelAndPageAction, setResultsAction, setQuestionsAction } = audiocallSlice.actions;

export default audiocallSlice.reducer;

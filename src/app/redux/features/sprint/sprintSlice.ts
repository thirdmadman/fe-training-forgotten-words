import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameAnswer } from '../../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import { IPaginatedArray } from '../../../interfaces/IPaginatedArray';
import { IResultData } from '../../../interfaces/IResultData';
import { IWord } from '../../../interfaces/IWord';
import { WordService } from '../../../services/WordService';

interface SprintPageState {
  questions: Array<IGameQuestion> | undefined;
  results: Array<IResultData> | undefined;
  answerChain: number;
  level: number;
  page: number;
}

const initialState: SprintPageState = {
  questions: undefined,
  results: undefined,
  answerChain: 0,
  level: -1,
  page: -1,
};

const createVariantForAnswer = (wordsArray: Array<IWord>, currentWord: IWord) => {
  const onlyDifferentWords = wordsArray.filter((word) => word.id !== currentWord.id);
  const shuffledAndCutArray = [...onlyDifferentWords].sort(() => Math.random() - 0.5).slice(0, 1);
  const variant = [currentWord, ...shuffledAndCutArray]
    .sort(() => Math.random() - 0.5)
    .slice(0, 1)
    .map((word) => {
      const isCorrect = word.id === currentWord.id;
      return {
        wordData: word,
        isCorrect,
      } as IGameAnswer;
    });
  return variant;
};

const createQuestions = (wordsArray: Array<IWord>) => {
  const result = wordsArray.map((word) => {
    const variants = createVariantForAnswer(wordsArray, word);
    return {
      wordData: word,
      variants,
    } as IGameQuestion;
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
  'sprint/getQuestions',
  getQuestions,
);

export const audiocallSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    resetSprint: () => initialState,
    setLevelAndPageAction: (state, action: PayloadAction<LevelAndPageArgs>) => {
      state.level = action.payload.level;
      state.page = action.payload.page;
    },
    setResultsAction: (state, action: PayloadAction<GameResults>) => {
      state.results = action.payload.results;
      state.answerChain = action.payload.answerChain;
    },
    setQuestionsAction: (state, action: PayloadAction<Array<IGameQuestion>>) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuestionsAction.fulfilled, (state, action) => {
      if (action.payload) {
        const questionsArray = createQuestions(action.payload.array);
        state.questions = questionsArray;
      }
    });
  },
});

export const { setLevelAndPageAction, setResultsAction, setQuestionsAction, resetSprint } = audiocallSlice.actions;

export default audiocallSlice.reducer;

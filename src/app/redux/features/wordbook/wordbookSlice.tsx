import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserWord } from '../../../interfaces/IUserWord';
import { IWord } from '../../../interfaces/IWord';
import { IWordAdvanced } from '../../../interfaces/IWordAdvanced';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { WordService } from '../../../services/WordService';
import { resetStateAuth } from '../auth/authSlice';

interface NavigateState {
  level: number;
  page: number;
}
interface WordBookState {
  dataIWordAdvanced: Array<IWordAdvanced> | null;
  lastNavigation?: NavigateState;
}

const initialState: WordBookState = {
  dataIWordAdvanced: null,
};

interface LoadDataResultType<T> {
  result: Array<T> | null;
  navigateState: NavigateState;
}

const mapWordToUserWord = (word: IWord, userWordsData: Array<IUserWord> | null) => {
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
};

const getUserWordsData = async (navigateState: NavigateState) => {
  const userId = TokenProvider.getUserId();
  const isExpired = TokenProvider.checkIsExpired();
  if (!isExpired && userId) {
    const userWords = await UserWordService.getAllWordsByUserId(userId);
    return { result: userWords, navigateState };
  }
  return { result: null, navigateState };
};

const getData = async (navigateState: NavigateState) => {
  const wordsData = await WordService.getWordsByGroupAndPage(navigateState.level - 1, navigateState.page - 1);
  const userWordsData = await getUserWordsData(navigateState);

  const output = wordsData.array.map((word) => mapWordToUserWord(word, userWordsData.result));

  return { result: output, navigateState };
};

export const loadWordsThunk = createAsyncThunk<LoadDataResultType<IWordAdvanced>, NavigateState>(
  'wordbook/loadWordsThunk',
  getData,
);
export const loadUserWordsDataThunk = createAsyncThunk<LoadDataResultType<IUserWord>, NavigateState>(
  'wordbook/loadUserWordsDataThunk',
  getUserWordsData,
);

export const wordbookSlice = createSlice({
  name: 'wordbook',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWordsThunk.fulfilled, (state, action) => {
      state.dataIWordAdvanced = action.payload.result;
      if (!state.lastNavigation) {
        state.lastNavigation = action.payload.navigateState;
      } else {
        state.lastNavigation = action.payload.navigateState;
      }
    });
    builder.addCase(loadUserWordsDataThunk.fulfilled, (state, action) => {
      if (!state.lastNavigation) {
        state.lastNavigation = action.payload.navigateState;
      } else {
        const notLevel = state.lastNavigation.level !== action.payload.navigateState.level;
        const notPage = state.lastNavigation.page !== action.payload.navigateState.page;
        if (notLevel && notPage) {
          state.lastNavigation = action.payload.navigateState;
          state.lastNavigation = action.payload.navigateState;
        }
      }

      if (action.payload.result) {
        if (state.dataIWordAdvanced) {
          state.dataIWordAdvanced.forEach((wordAdvanced) => {
            if (state.dataIWordAdvanced && action.payload.result) {
              const userData = action.payload.result.find((userWord) => userWord.wordId === wordAdvanced.word.id);
              if (userData) {
                wordAdvanced.userData = userData;
              }
            }
          });
        }
      }
    });
    builder.addCase(resetStateAuth, () => initialState);
  },
});

// export const { } = wordbookSlice.actions;

export default wordbookSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IWordAdvanced } from '../../../interfaces/IWordAdvanced';
import { TokenProvider } from '../../../services/TokenProvider';
import { UsersAggregatedWordsService } from '../../../services/UsersAggregatedWordsService';
import { convertAggregatedWordToWordAdvanced } from '../../../utils/convertAggregatedWordToWordAdvanced';

interface DiaryPageState {
  userDiaryWords: Array<IWordAdvanced> | null;
  currentPage: number | null;
  totalSize: number | null;
}

const initialState: DiaryPageState = {
  userDiaryWords: null,
  currentPage: null,
  totalSize: null,
};

interface NavigateArgs {
  page: number;
  wordsPerPage: number;
}

const getData = async (navigateArgs: NavigateArgs) => {
  const isExpired = TokenProvider.checkIsExpired();
  const userId = TokenProvider.getUserId();

  if (isExpired || !userId) {
    return null;
  }

  const output = await UsersAggregatedWordsService.getAggregatedWordsWithResults(
    userId,
    navigateArgs.page,
    navigateArgs.wordsPerPage,
  )
    .then((userAggregatedWords) => {
      if (userAggregatedWords) {
        const { array } = userAggregatedWords;
        const convertedWords = array.map(convertAggregatedWordToWordAdvanced);

        return {
          userDiaryWords: convertedWords,
          currentPage: userAggregatedWords.currentPage,
          totalSize: userAggregatedWords.size,
        };
      }
      return null;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  return output;
};

export const loadData = createAsyncThunk<DiaryPageState | null, NavigateArgs>('diary/loadPageData', getData);

export const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadData.fulfilled, (state, action) => {
      if (action.payload) {
        state.userDiaryWords = action.payload.userDiaryWords;
        state.currentPage = action.payload.currentPage;
        state.totalSize = action.payload.totalSize;
      }
    });
  },
});

// export const { } = diarySlice.actions;

export default diarySlice.reducer;

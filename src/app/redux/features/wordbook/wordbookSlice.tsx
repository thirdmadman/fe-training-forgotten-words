import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserWord } from '../../../interfaces/IUserWord';
import { IWord } from '../../../interfaces/IWord';
import { IWordAdvanced } from '../../../interfaces/IWordAdvanced';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { WordService } from '../../../services/WordService';

interface WordBookState {
  dataIWordAdvanced: Array<IWordAdvanced> | null;
}

const initialState: WordBookState = {
  dataIWordAdvanced: null,
};

interface NavigateState {
  level: number;
  page: number;
}

const getData = async (navigateState: NavigateState) => {
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

  const output = await WordService.getWordsByGroupAndPage(navigateState.level - 1, navigateState.page - 1)
    .then((data) => {
      const userId = TokenProvider.getUserId();
      const isExpired = TokenProvider.checkIsExpired();
      if (!isExpired && userId) {
        return UserWordService.getAllWordsByUserId(userId)
          .then((userWordsData) => data.array.map((word) => mapWordToUserWord(word, userWordsData)))
          .catch((e) => {
            console.error(e);
            return null;
          });
      }

      return data.array.map((word) => ({ word } as IWordAdvanced));
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  return output;
};

export const loadData = createAsyncThunk<Array<IWordAdvanced> | null, NavigateState>('wordbook/loadPageData', getData);

export const wordbookSlice = createSlice({
  name: 'wordbook',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadData.fulfilled, (state, action) => {
      state.dataIWordAdvanced = action.payload;
    });
  },
});

// export const { } = wordbookSlice.actions;

export default wordbookSlice.reducer;

import { GlobalConstants } from '../../GlobalConstants';
import { IUserWord } from '../interfaces/IUserWord';
import { IUserWordData } from '../interfaces/IUserWordData';
import { IUserWordOptional } from '../interfaces/IUserWordOptional';
import { axiosInstance } from './axiosInstance';

export class UserWordService {
  /**
   * This method uses token
   */
  static getAllWordsByUserId(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/words`, { validateStatus: () => true })
      .then((res) => (res.status === 200 ? (res.data as Array<IUserWord>) : null));
  }

  /**
   * This method uses token
   */
  static getUserWordById(userId: string, wordId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/words/${wordId}`, { validateStatus: () => true })
      .then((res) => (res.status === 200 ? (res.data as IUserWord) : null));
  }

  /**
   * This method uses token
   */
  static createUserWord(userId: string, wordId: string, userWordData: IUserWordData) {
    return axiosInstance()
      .post(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/words/${wordId}`, userWordData)
      .then((res) => res.data as IUserWord);
  }

  /**
   * This method uses token
   */
  static updateUserWord(userId: string, wordId: string, userWordData: IUserWordData) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/words/${wordId}`, userWordData)
      .then((res) => res.data as IUserWord);
  }

  /**
   * This method uses token
   */
  static deleteUserWord(userId: string, wordId: string) {
    return axiosInstance().delete(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/words/${wordId}`);
  }

  /**
   * This method uses token
   */
  private static setWorDifficultyById(userId: string, wordId: string, difficulty: string) {
    const getWord = this.getAllWordsByUserId(userId).then((data) => {
      if (data) {
        const wordData = data.find((word) => word.wordId === wordId);
        if (wordData) {
          return {
            difficulty,
            optional: { ...wordData.optional },
          } as IUserWordData;
        }
      }

      return null;
    });

    return getWord.then((data) => {
      if (!data) {
        return UserWordService.createUserWord(userId, wordId, {
          difficulty,
          optional: {
            successCounter: 0,
            failCounter: 0,
            isLearned: false,
          },
        } as IUserWordData);
      }
      return this.updateUserWord(userId, wordId, data);
    });
  }

  /**
   * This method uses token
   */
  private static setWordLearnedState(userId: string, wordId: string, isLearned: boolean) {
    const getWord = this.getAllWordsByUserId(userId).then((data) => {
      if (data) {
        const wordData = data.find((word) => word.wordId === wordId);
        if (wordData) {
          return {
            difficulty: wordData.difficulty,
            optional: {
              successCounter: wordData.optional.successCounter,
              failCounter: wordData.optional.failCounter,
              isLearned,
            } as IUserWordOptional,
          } as IUserWordData;
        }
      }

      return null;
    });

    return getWord.then((data) => {
      if (!data) {
        return UserWordService.createUserWord(userId, wordId, {
          difficulty: 'normal',
          optional: {
            successCounter: 0,
            failCounter: 0,
            isLearned,
          },
        } as IUserWordData);
      }
      return this.updateUserWord(userId, wordId, data);
    });
  }

  /**
   * This method uses token
   */
  static addWordLearnedById(userId: string, wordId: string) {
    return this.setWordLearnedState(userId, wordId, true);
  }

  /**
   * This method uses token
   */
  static removeWordFromLearnedById(userId: string, wordId: string) {
    return this.setWordLearnedState(userId, wordId, false);
  }

  /**
   * This method uses token
   */
  static setWorDifficultById(userId: string, wordId: string) {
    return this.setWorDifficultyById(userId, wordId, 'hard');
  }

  /**
   * This method uses token
   */
  static setWordNormalById(userId: string, wordId: string) {
    return this.setWorDifficultyById(userId, wordId, 'normal');
  }

  static setWordStatistic(userId: string, wordId: string, isCorrect: boolean) {
    const getData = this.getUserWordById(userId, wordId).then((data) => {
      console.error(data);
      const wordData = data;
      if (wordData) {
        const oldParameters = { ...wordData.optional };
        const parameters = {
          successCounter: isCorrect ? (oldParameters.successCounter += 1) : oldParameters.successCounter,
          failCounter: isCorrect ? oldParameters.successCounter : (oldParameters.failCounter += 1),
          isLearned: oldParameters.isLearned,
        };
        return {
          difficulty: wordData.difficulty,
          optional: parameters,
        } as IUserWordData;
      }
      return null;
    });

    return getData.then((wordData) => {
      if (!wordData) {
        const parameters = {
          successCounter: isCorrect ? 1 : 0,
          failCounter: isCorrect ? 0 : 1,
          isLearned: false,
        };
        return UserWordService.createUserWord(userId, wordId, {
          difficulty: 'normal',
          optional: parameters,
        } as IUserWordData);
      }
      return UserWordService.updateUserWord(userId, wordId, wordData);
    });
  }
}

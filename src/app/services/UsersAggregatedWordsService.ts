import { GlobalConstants } from '../../GlobalConstants';
import { IPaginatedArray } from '../interfaces/IPaginatedArray';
import { axiosInstance } from './axiosInstance';
import { IAggregatedWord } from '../interfaces/IAggregatedWord';

type IPaginatedResults = [
  {
    paginatedResults: Array<IAggregatedWord>;
    totalCount: [
      {
        count: number;
      },
    ];
  },
];

export class UsersAggregatedWordsService {
  /**
   * This method uses token
   */
  static getAllAggregatedWordsByUserId(userId: string, group = -1, page = -1, wordsPerPage = -1, filter = '') {
    const params = new URLSearchParams();
    if (group > -1) {
      params.append('group', String(group));
    }
    if (page > -1) {
      params.append('page', String(page));
    }
    if (wordsPerPage > -1) {
      params.append('wordsPerPage', String(wordsPerPage));
    }
    if (filter.length > 0) {
      params.append('filter', String(filter));
    }
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/aggregatedWords`, { params })
      .then((res) => {
        const resultData = res.data as IPaginatedResults;
        return {
          array: [...resultData[0].paginatedResults],
          pageSize: wordsPerPage,
          currentGroup: group,
          currentPage: page,
          size: resultData[0].totalCount[0].count,
        } as IPaginatedArray<IAggregatedWord>;
      });
  }

  /**
   * This method uses token
   */
  static getAggregatedWordsByUserIdAndWordId(userId: string, wordId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/aggregatedWords/${wordId}`)
      .then((res) => {
        const resultData = res.data as Array<IAggregatedWord>;
        return resultData[0];
      });
  }
}

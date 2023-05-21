import { GlobalConstants } from '../../GlobalConstants';
import { IPaginatedArray } from '../interfaces/IPaginatedArray';
import { axiosInstance } from './axiosInstance';
import { IAggregatedWord } from '../interfaces/IAggregatedWord';
import { IPaginatedResults } from '../interfaces/IPaginatedResults';

export class UsersAggregatedWordsService {
  /**
   * This method uses token
   */
  static getAllAggregatedWordsByUserId(
    userId: string,
    group = -1,
    paginationPage = -1,
    wordsPerPage = -1,
    filter = '',
  ) {
    const params = new URLSearchParams();
    if (group > -1) {
      params.append('group', String(group));
    }
    if (paginationPage > -1) {
      params.append('page', String(paginationPage));
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
        if (res.data) {
          const data = res.data as Array<IPaginatedResults>;
          const resultData = data[0];
          const respCount = resultData.totalCount[0].count;
          const pageSize = respCount < wordsPerPage ? respCount : wordsPerPage;
          return {
            array: [...resultData.paginatedResults],
            pageSize: wordsPerPage,
            currentGroup: group,
            currentPage: paginationPage,
            size: pageSize,
          } as IPaginatedArray<IAggregatedWord>;
        }
        return null;
      });
  }

  /**
   * This method uses token
   */
  static getAggregatedWordsWithResults(userId: string, paginationPage = -1, wordsPerPage = -1) {
    return this.getAllAggregatedWordsByUserId(
      userId,
      -1,
      paginationPage,
      wordsPerPage,
      '{"userWord": { "$exists": true}}',
    );
  }
}

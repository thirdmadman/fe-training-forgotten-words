import { IAggregatedWord } from './IAggregatedWord';

export interface IPaginatedResults {
  paginatedResults: Array<IAggregatedWord>;
  totalCount: [
    {
      count: number;
    },
  ];
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { CardsContainer } from '../../components/common/cardsContainer/CardsContainer';
import { Pagination } from '../../components/common/pagination/Pagination';
import { Spinner } from '../../components/common/spinner/Spinner';
import { IAggregatedWord } from '../../interfaces/IAggregatedWord';
import { IPaginatedArray } from '../../interfaces/IPaginatedArray';
import { TokenProvider } from '../../services/TokenProvider';
import { UsersAggregatedWordsService } from '../../services/UsersAggregatedWordsService';
import './diaryPage.scss';

export function DiaryPage() {
  const WORDS_PER_DIARY_PAGE = 50;
  const navigate = useNavigate();
  const params = useParams();
  const [userDiaryWords, setUserDiaryWords] = useState<IPaginatedArray<IAggregatedWord> | null>(null);

  const pageNumber = userDiaryWords ? userDiaryWords.currentPage : 0;
  const totalPages = userDiaryWords ? Math.floor(userDiaryWords.size / WORDS_PER_DIARY_PAGE) : 0;

  const page = Number(params.page ? params.page : '1') - 1;

  const changePage = (direction: string) => {
    if (direction === 'prev') {
      if (page > 0) {
        navigate(`${GlobalConstants.ROUTE_DIARY}/${pageNumber}`);
      }
    }

    if (direction === 'next') {
      if (page < totalPages) {
        navigate(`${GlobalConstants.ROUTE_DIARY}/${pageNumber + 2}`);
      }
    }
  };

  useEffect(() => {
    if (!params.page) {
      navigate(`${GlobalConstants.ROUTE_DIARY}/1`);
      return;
    }

    const userId = TokenProvider.getUserId();
    if (userId && !TokenProvider.checkIsExpired()) {
      UsersAggregatedWordsService.getAggregatedWordsWithResults(userId, page, WORDS_PER_DIARY_PAGE)
        .then((userAggregatedWords) => setUserDiaryWords(userAggregatedWords))
        .catch((e) => console.error(e));
    }
  }, [setUserDiaryWords, page, navigate, params]);

  return (
    <div className="diary">
      <div className="diary__title">Diary</div>
      <div className="navigation-container">
        <Pagination
          text={`Page number ${pageNumber + 1}/${totalPages + 1}`}
          onPreviousAction={() => changePage('prev')}
          onNextAction={() => changePage('next')}
        />
      </div>
      {userDiaryWords ? (
        <CardsContainer paginatedArrayOfIWord={null} paginatedArrayOfIAggregatedWord={userDiaryWords} />
      ) : (
        <Spinner />
      )}
    </div>
  );
}

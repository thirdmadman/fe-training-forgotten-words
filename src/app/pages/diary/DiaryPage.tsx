import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { Card } from '../../components/common/card/Card';
import { Pagination } from '../../components/common/pagination/Pagination';
import { Spinner } from '../../components/common/spinner/Spinner';
import './diaryPage.scss';
import '../../components/common/cardsContainer/CardsContainer.scss';
import { loadData } from '../../redux/features/diary/diarySlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

export function DiaryPage() {
  const WORDS_PER_DIARY_PAGE = 50;
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { userDiaryWords, currentPage, totalSize } = useAppSelector((state) => state.diary);

  const pageNumber = currentPage || 0;
  const totalPages = totalSize ? Math.floor(totalSize / WORDS_PER_DIARY_PAGE) : 0;

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

    dispatch(loadData({ page, wordsPerPage: WORDS_PER_DIARY_PAGE })).catch(() => {});
  }, [page, navigate, params, dispatch]);

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
        <div className="cards-container">
          {userDiaryWords && userDiaryWords.map((word) => <Card wordAdvanced={word} key={word.word.id} />)}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

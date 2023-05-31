import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { Spinner } from '../../components/common/spinner/Spinner';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { Pagination } from '../../components/common/pagination/Pagination';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { Card } from '../../components/common/card/Card';
import { loadData } from '../../redux/features/wordbook/wordbookSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import './WordBook.scss';
import '../../components/common/cardsContainer/CardsContainer.scss';

export default function WordBook() {
  const { dataIWordAdvanced, lastNavigation } = useAppSelector((state) => state.wordbook);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const currentLevel = Number(params.level ? params.level : '1');
  const currentPage = Number(params.page ? params.page : '1');

  const { NUMBER_OF_PAGES, NUMBER_OF_GROUP_NO_AUTH_USER, ROUTE_WORDBOOK } = GlobalConstants;

  const { WORDBOOK_MUSIC_NAME, MUSIC_PATH } = GlobalConstants;

  const changePage = (btn: string) => {
    if (!dataIWordAdvanced) return;

    if (btn === 'prev') {
      if (currentPage > 1) {
        navigate(`${ROUTE_WORDBOOK}/${currentLevel}/${currentPage - 1}`);
      }
    }

    if (btn === 'next') {
      if (currentPage < NUMBER_OF_PAGES) {
        navigate(`${ROUTE_WORDBOOK}/${currentLevel}/${currentPage + 1}`);
      }
    }
  };

  const changeLevel = (btn: string) => {
    if (!dataIWordAdvanced) return;

    if (btn === 'prev') {
      if (currentLevel > 1) {
        navigate(`${ROUTE_WORDBOOK}/${currentLevel - 1}/${currentPage}`);
      }
    }

    if (btn === 'next') {
      if (currentLevel < NUMBER_OF_GROUP_NO_AUTH_USER) {
        navigate(`${ROUTE_WORDBOOK}/${currentLevel + 1}/${currentPage}`);
      }
    }
  };

  useEffect(() => {
    if (!params.level || !params.page) {
      if (lastNavigation) {
        const { level, page } = lastNavigation;
        navigate(`${GlobalConstants.ROUTE_WORDBOOK}/${level}/${page}`);
        return;
      }

      navigate(`${GlobalConstants.ROUTE_WORDBOOK}/1/1`);
      return;
    }

    const currentTrack = musicPlayer2.getCurrentPlayingTrack();
    if (!currentTrack || currentTrack.indexOf(WORDBOOK_MUSIC_NAME) < 0) {
      const userConfigs = DataLocalStorageProvider.getData();

      const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
      const musicVolume = musicVolumeMultiplier * 0.09;

      musicPlayer2.setVolume(musicVolume);
      musicPlayer2.setPlayList([`${MUSIC_PATH + WORDBOOK_MUSIC_NAME}`], true);
      musicPlayer2.play().catch(() => {});
    }

    if (!dataIWordAdvanced || lastNavigation?.level !== currentLevel || lastNavigation?.page !== currentPage) {
      dispatch(loadData({ level: currentLevel, page: currentPage })).catch(() => {});
    }
  }, [
    MUSIC_PATH,
    WORDBOOK_MUSIC_NAME,
    currentLevel,
    currentPage,
    dispatch,
    lastNavigation,
    navigate,
    params.level,
    params.page,
    dataIWordAdvanced,
  ]);

  return (
    <div className="wordbook">
      <div className="wordbook__title">Their memories</div>
      <div className="navigation-container">
        <Pagination
          text={`Page number ${currentPage}/${NUMBER_OF_PAGES}`}
          onPreviousAction={() => changePage('prev')}
          onNextAction={() => changePage('next')}
        />
        <Pagination
          text={`Depth level ${currentLevel}/${NUMBER_OF_GROUP_NO_AUTH_USER}`}
          onPreviousAction={() => changeLevel('prev')}
          onNextAction={() => changeLevel('next')}
        />
      </div>
      {dataIWordAdvanced ? (
        <div className="cards-container">
          {dataIWordAdvanced && dataIWordAdvanced.map((word) => <Card wordAdvanced={word} key={word.word.id} />)}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

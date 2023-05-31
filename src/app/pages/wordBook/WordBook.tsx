import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { Spinner } from '../../components/common/spinner/Spinner';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { Pagination } from '../../components/common/pagination/Pagination';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { IStateStore } from '../../interfaces/IStateStore';
import { Card } from '../../components/common/card/Card';
import { AppDispatch, RootState } from '../../store';
import './WordBook.scss';
import '../../components/common/cardsContainer/CardsContainer.scss';
import { loadData } from '../../redux/features/wordbook/wordbookSlice';

export default function WordBook() {
  const { dataIWordAdvanced } = useSelector((state: RootState) => state.wordbook);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const level = Number(params.level ? params.level : '1');
  const page = Number(params.page ? params.page : '1');

  const { NUMBER_OF_PAGES, NUMBER_OF_GROUP_NO_AUTH_USER, ROUTE_WORDBOOK } = GlobalConstants;

  const { WORDBOOK_MUSIC_NAME, MUSIC_PATH } = GlobalConstants;

  const changePage = (btn: string) => {
    if (!dataIWordAdvanced) return;

    if (btn === 'prev') {
      if (page > 1) {
        navigate(`${ROUTE_WORDBOOK}/${level}/${page - 1}`);
      }
    }

    if (btn === 'next') {
      if (page < NUMBER_OF_PAGES) {
        navigate(`${ROUTE_WORDBOOK}/${level}/${page + 1}`);
      }
    }
  };

  const changeLevel = (btn: string) => {
    if (!dataIWordAdvanced) return;

    if (btn === 'prev') {
      if (level > 1) {
        navigate(`${ROUTE_WORDBOOK}/${level - 1}/${page}`);
      }
    }

    if (btn === 'next') {
      if (level < NUMBER_OF_GROUP_NO_AUTH_USER) {
        navigate(`${ROUTE_WORDBOOK}/${level + 1}/${page}`);
      }
    }
  };

  useEffect(() => {
    if (!params.level || !params.page) {
      const localData = DataLocalStorageProvider.getData();
      const { stateStore } = localData;
      if (stateStore && stateStore.wordBook) {
        const { lastWordBookOpenLevel, lastWordBookOpenPage } = stateStore.wordBook;
        navigate(`${GlobalConstants.ROUTE_WORDBOOK}/${lastWordBookOpenLevel}/${lastWordBookOpenPage}`);
        return;
      }

      navigate(`${GlobalConstants.ROUTE_WORDBOOK}/1/1`);
      return;
    }

    const localData = { ...DataLocalStorageProvider.getData() };
    const { stateStore } = localData;

    const wordBook = { lastWordBookOpenLevel: level, lastWordBookOpenPage: page };

    const newStateStore = {
      wordBook,
      lastRoute: '',
    } as IStateStore;

    if (!stateStore) {
      localData.stateStore = newStateStore;
    } else if (!stateStore.wordBook) {
      stateStore.wordBook = wordBook;
      localData.stateStore = newStateStore;
    }

    localData.stateStore = newStateStore;

    DataLocalStorageProvider.setData(localData);

    const currentTrack = musicPlayer2.getCurrentPlayingTrack();
    if (!currentTrack || currentTrack.indexOf(WORDBOOK_MUSIC_NAME) < 0) {
      const userConfigs = DataLocalStorageProvider.getData();

      const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
      const musicVolume = musicVolumeMultiplier * 0.09;

      musicPlayer2.setVolume(musicVolume);
      musicPlayer2.setPlayList([`${MUSIC_PATH + WORDBOOK_MUSIC_NAME}`], true);
      musicPlayer2.play().catch(() => {});
    }

    dispatch(loadData({ level, page })).catch(() => {});
  }, [level, page, params, navigate, MUSIC_PATH, WORDBOOK_MUSIC_NAME, dispatch]);

  return (
    <div className="wordbook">
      <div className="wordbook__title">Their memories</div>
      <div className="navigation-container">
        <Pagination
          text={`Page number ${page}/${NUMBER_OF_PAGES}`}
          onPreviousAction={() => changePage('prev')}
          onNextAction={() => changePage('next')}
        />
        <Pagination
          text={`Depth level ${level}/${NUMBER_OF_GROUP_NO_AUTH_USER}`}
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

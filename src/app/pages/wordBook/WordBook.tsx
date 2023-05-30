import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { IPaginatedArray } from '../../interfaces/IPaginatedArray';
import { IWord } from '../../interfaces/IWord';
import { WordService } from '../../services/WordService';
import { Spinner } from '../../components/common/spinner/Spinner';
import { CardsContainer } from '../../components/common/cardsContainer/CardsContainer';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import './WordBook.scss';
import { Pagination } from '../../components/common/pagination/Pagination';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { IStateStore } from '../../interfaces/IStateStore';

interface WordBookState {
  dataCards: IPaginatedArray<IWord> | null;
}

export default function WordBook() {
  const initialState = {
    dataCards: null,
  };

  const [state, setState] = useState<WordBookState>(initialState);
  const { dataCards } = state;

  const navigate = useNavigate();

  const params = useParams();

  const level = Number(params.level ? params.level : '1');
  const page = Number(params.page ? params.page : '1');

  const { NUMBER_OF_PAGES, NUMBER_OF_GROUP_NO_AUTH_USER, ROUTE_WORDBOOK } = GlobalConstants;

  const { WORDBOOK_MUSIC_NAME, MUSIC_PATH } = GlobalConstants;

  const changePage = (btn: string) => {
    if (!dataCards) return;

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
    if (!dataCards) return;

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

    WordService.getWordsByGroupAndPage(level - 1, page - 1)
      .then((data) => {
        setState({ dataCards: data });
      })
      .catch((e) => console.error(e));
  }, [level, page, params, navigate, MUSIC_PATH, WORDBOOK_MUSIC_NAME]);

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
      {dataCards ? (
        <CardsContainer paginatedArrayOfIWord={dataCards} paginatedArrayOfIAggregatedWord={null} />
      ) : (
        <Spinner />
      )}
    </div>
  );
}

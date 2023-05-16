export class GlobalConstants {
  public static APP_NAME = 'Forgotten Words';

  public static DEFAULT_API_URL = process.env.NODE_ENV === 'development' ? process.env.DEFAULT_API_URL || '' : '/api';

  public static ROUTE_MAIN = '/';

  public static API_ENDPOINT_WORDS = '/words';

  public static API_ENDPOINT_USERS = '/users';

  public static API_ENDPOINT_SIGNIN = '/signin';

  public static ROUTE_AUTH = '/auth';

  public static ROUTE_WORDBOOK = '/wordbook';

  public static ROUTE_AUDIOCALL = '/audiocall';

  public static ROUTE_SPRINT = '/sprint';

  public static ROUTE_VOCABULARY = '/vocabulary';

  public static ROUTE_STATISTICS = '/statistics';

  public static NUMBER_OF_PAGES = 30;

  public static NUMBER_OF_GROUP_NO_AUTH_USER = 6;

  public static NUMBER_OF_GROUP_AUTH_USER = 7;

  public static GAME_TIME = 60;

  public static MUSIC_PATH = './static/music/';

  public static WORDBOOK_MUSIC_NAME = 'wordbook.mp3';

  public static AUDIOCALL_MUSIC_NAME = 'audiocall.mp3';

  public static AUTH_MUSIC_NAME = 'auth.mp3';

  public static SPRINT_MUSIC_NAME = 'sprint.mp3';
}

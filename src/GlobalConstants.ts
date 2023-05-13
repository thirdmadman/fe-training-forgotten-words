export class GlobalConstants {
  public static DEFAULT_API_URL = process.env.NODE_ENV === 'development' ? process.env.DEFAULT_API_URL : '/api';

  public static ROUTE_MAIN = '/';

  public static APP_NAME = 'Forgotten Words';
}

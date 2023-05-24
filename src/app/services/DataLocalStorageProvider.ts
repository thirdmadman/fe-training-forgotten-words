import { ILocalConfigs } from '../interfaces/ILocalConfigs';
import { IUserConfigs } from '../interfaces/IUserConfigs';

const CONFIGS_VERSION = 1;

class DataLocalStorageProvider {
  static localStorageItemName = 'thirdmadman-forgotten-words';

  public static setData(data: ILocalConfigs) {
    localStorage.setItem(DataLocalStorageProvider.localStorageItemName, JSON.stringify(data));
  }

  public static isNotEmpty() {
    const localStorageData = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);

    if (localStorageData && localStorageData[0] === '{') {
      const dataILocalConfigs = JSON.parse(localStorageData) as ILocalConfigs;
      const localStorageKeysNumber = Object.keys(dataILocalConfigs).length;
      if (localStorageKeysNumber > 0) {
        return true;
      }
    }

    return false;
  }

  public static destroy() {
    localStorage.removeItem(DataLocalStorageProvider.localStorageItemName);
  }

  public static getData() {
    if (DataLocalStorageProvider.isNotEmpty()) {
      const localStorageData = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);
      if (localStorageData) {
        const dataILocalConfigs = JSON.parse(localStorageData) as ILocalConfigs;
        if (dataILocalConfigs.version && dataILocalConfigs.version === CONFIGS_VERSION) {
          return dataILocalConfigs;
        }
      }
    }

    const generatedData = DataLocalStorageProvider.generateData();
    DataLocalStorageProvider.setData(generatedData);
    return generatedData;
  }

  private static generateData() {
    const userConfigs = {
      musicLevel: 1,
      soundsLevel: 1,
      gameDifficulty: 1,
      isRememberAuthData: true,
    } as IUserConfigs;

    const configs = {
      isExists: true,
      userConfigs,
      version: CONFIGS_VERSION,
    };
    return configs as ILocalConfigs;
  }
}

export default DataLocalStorageProvider;

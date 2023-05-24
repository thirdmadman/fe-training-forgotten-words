import { ILocalConfigs } from '../interfaces/ILocalConfigs';

class DataLocalStorageProvider {
  static localStorageItemName = 'thirdmadman-forgotten-words';

  public static setData(data: ILocalConfigs) {
    localStorage.setItem(DataLocalStorageProvider.localStorageItemName, JSON.stringify(data));
  }

  public static isNotEmpty() {
    const localStorageData = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);
    return localStorageData && localStorageData[0] === '{';
  }

  public static destroy() {
    localStorage.removeItem(DataLocalStorageProvider.localStorageItemName);
  }

  public static getData(): ILocalConfigs | null {
    const data = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);
    let localStorageKeysNumber = 0;
    let dataIConfigs = null;
    if (data) {
      dataIConfigs = JSON.parse(data) as ILocalConfigs;
      localStorageKeysNumber = Object.keys(dataIConfigs).length;
    }

    if (DataLocalStorageProvider.isNotEmpty()) {
      if (localStorageKeysNumber > 0) {
        return dataIConfigs;
      }
    } else {
      const generatedData = DataLocalStorageProvider.generateData();
      DataLocalStorageProvider.setData(generatedData);
      return generatedData;
    }
    return null;
  }

  private static generateData() {
    const configs = {
      isExists: false,
    };
    return configs as ILocalConfigs;
  }
}

export default DataLocalStorageProvider;

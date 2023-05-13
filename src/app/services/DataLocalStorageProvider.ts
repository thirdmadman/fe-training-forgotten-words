import { IConfigs } from '../interfaces/IConfigs';

class DataLocalStorageProvider {
  static localStorageItemName = 'thirdmadman-rs-lang';

  public static setData(data: IConfigs) {
    localStorage.setItem(DataLocalStorageProvider.localStorageItemName, JSON.stringify(data));
  }

  public static isNotEmpty() {
    const localStorageData = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);
    return localStorageData && localStorageData[0] === '{';
  }

  public static destroy() {
    localStorage.removeItem(DataLocalStorageProvider.localStorageItemName);
  }

  public static getData(): IConfigs | null {
    const data = localStorage.getItem(DataLocalStorageProvider.localStorageItemName);
    let localStorageKeysNumber = 0;
    let dataIConfigs = null;
    if (data) {
      dataIConfigs = JSON.parse(data) as IConfigs;
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
    return configs as IConfigs;
  }
}

export default DataLocalStorageProvider;

export class PathBus {
  static data: object;

  static path: string;

  static callbacksArray = new Array<(path: string, data: object) => void>();

  static setCurrentPath(path: string, data: object = {}) {
    PathBus.path = path;
    window.location.hash = path;
    PathBus.callbacksArray.forEach((callback) => {
      callback(path, data);
    });
  }

  static getCurrentPath() {
    return PathBus.path;
  }

  static getRealCurrentPath() {
    return window.location.hash.slice(1);
  }

  static addPathChangeListener(callback: (path: string, data: object) => void) {
    PathBus.callbacksArray.push(callback);
  }
}

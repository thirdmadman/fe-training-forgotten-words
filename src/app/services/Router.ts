import { PathBus } from './PathBus';

interface IRoute {
  path: string;
  controller: (path: string, data: object) => void;
}

export class Router {
  private routes: Array<IRoute> = new Array<IRoute>();

  constructor() {
    window.addEventListener('hashchange', () => {
      if (window.location.hash.slice(1) !== PathBus.getCurrentPath()) {
        PathBus.setCurrentPath(window.location.hash.slice(1));
      }
    });

    PathBus.addPathChangeListener((path, data) => {
      this.resolve(path, data);
    });
  }

  addRoute(routePath: string, routeController: (path: string, data: object) => void) {
    this.routes.push({ path: routePath, controller: routeController });
  }

  resolve(path: string, data: object) {
    this.routes.forEach((route: IRoute) => {
      if (route.path === `/${path.split('/')[1]}`) {
        route.controller(path.replace(route.path, ''), data);
      }
    });
  }
}

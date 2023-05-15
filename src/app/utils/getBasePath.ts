import { useLocation, useParams } from 'react-router-dom';

export const useBasePath = () => {
  const location = useLocation();
  const params = useParams<Record<string, string>>();

  console.log(location, params);

  return Object.values(params).reduce((path, param) => {
    if (path && param) {
      return path.replace(`/${param}`, '');
    }
    return '';
  }, location.pathname);
};

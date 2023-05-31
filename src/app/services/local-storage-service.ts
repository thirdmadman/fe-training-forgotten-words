const appName = process.env.APP_NAME || 'fw';
const STORAGE_KEY = `__SERIALIZED_STATE_TREE_${appName}__`;

export function saveState<T = object>(storeState: T): boolean {
  if (!localStorage) {
    return false;
  }

  try {
    const serializedState = JSON.stringify(storeState);
    localStorage.setItem(STORAGE_KEY, serializedState);
    return true;
  } catch (error) {
    throw new Error('store serialization failed');
  }
}

export function loadState<T = object>(): T | undefined {
  if (!localStorage) {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    throw new Error('store deserialization failed');
  }
}

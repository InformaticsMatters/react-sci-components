import { STATE_KEY, doNotSerialize } from './stateConfig';

export const resolveState = <T>(reducerName: string, initialState: T): T => {
  const storedStateJson = localStorage.getItem(STATE_KEY);
  const storedState = storedStateJson && JSON.parse(storedStateJson);
  if (storedState && storedState.hasOwnProperty(reducerName) && !doNotSerialize.has(reducerName)) {
    return storedState[reducerName];
  } else {
    return initialState;
  }
};

export const filterOutFromState = <T extends { [key: string]: any }>(state: T): T => {
  const filteredState = { ...state };

  Object.keys(filteredState).forEach((key) => {
    if (doNotSerialize.has(key)) {
      delete filteredState[key];
    }
  });

  return filteredState;
};

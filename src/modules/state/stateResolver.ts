import {doNotSerialize} from './stateConfig';

export const resolveState = <T>(reducerName: string, initialState: T): T => {
  const storedStateJson = localStorage.getItem('state');
  const storedState = storedStateJson && JSON.parse(storedStateJson);
  if (storedState && storedState.hasOwnProperty(reducerName) && !doNotSerialize.has(reducerName)) {
    return storedState[reducerName];
  } else {
    return initialState;
  }
};

export const filterOutFromState = <T>(state: T): T => {
  const filteredState: T = {...state};

  (Object.keys(filteredState)as Array<keyof T>).forEach((key) => {
    if (doNotSerialize.has(key.toString())) {
      delete filteredState[key];
    }
  });

  return filteredState;
};

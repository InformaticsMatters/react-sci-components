export const resolveState = <T>(reducerName: string, initialState: T): T => {
  const storedStateJson = localStorage.getItem('state');
  const storedState = storedStateJson && JSON.parse(storedStateJson);
  if (storedState && storedState.hasOwnProperty(reducerName)) {
    return storedState[reducerName];
  } else {
    return initialState;
  }
};

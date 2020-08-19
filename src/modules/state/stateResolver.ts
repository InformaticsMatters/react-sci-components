export const resolveState = (reducerName: string, initialState: any = {}) => {
    const storedStateJson = localStorage.getItem('state');
    const storedState = storedStateJson && JSON.parse(storedStateJson);
    if (storedState && storedState.hasOwnProperty(reducerName)) {
        return storedState[reducerName];
    } else {
        return initialState;
    }
};
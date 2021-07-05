import { useEffect, useState } from 'react';

import { getStore } from 'hooks-for-redux';

export const useStoreState = () => {
  const store = getStore();
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const store = getStore();

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setState(state);
    });
    return unsubscribe;
  }, []);

  return state;
};

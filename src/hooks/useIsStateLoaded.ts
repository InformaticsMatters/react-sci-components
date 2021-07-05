import { useEffect, useState } from 'react';

import { STATE_KEY } from '../modules/state/stateConfig';

/**
 * Check if state is in localStorage. localStorage is cleared when state
 * is loaded so this shows whether state is still being loaded.
 * @privateRemarks
 * Can't do this with a 'storage' event listener or retrieving
 * localStorage each render due to the update order.
 */
export const useIsStateLoaded = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const item = localStorage.getItem(STATE_KEY);
      if (item === null) {
        setLoading(false);
        clearInterval(id);
      } else {
        setLoading(true);
      }
    }, 200);

    return () => clearInterval(id);
  }, []);

  return loading;
};

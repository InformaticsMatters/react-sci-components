import { useRedux } from 'hooks-for-redux';

import { settingsStore } from '../settings/settings';
import { resolveState } from '../state/stateResolver';
import {initializeModule, subscribeToInitAll} from '../state/stateConfig';


export interface Protein {
  definition: string;
}

export interface ProteinState {
  protein: Protein;
  isProteinLoading: boolean;
}

export const initialState: ProteinState = {
  protein: { definition: '' },
  isProteinLoading: false,
};

export const [useProtein, { setProtein, setIsProteinLoading }, proteinStore] = useRedux(
  'protein',
  resolveState('protein', initialState),
  {
    setProtein: (state, protein: Protein) => ({ ...state, protein }),
    setIsProteinLoading: (state, isProteinLoading: boolean) => ({ ...state, isProteinLoading }),
  },
);

const loadProtein = ({proteinPath}: {proteinPath: string}) => {
  setIsProteinLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + proteinPath, { mode: 'cors' })
    .then((resp) => {
      resp.text().then((pdb) => {
        console.log(pdb);
        setProtein({ definition: pdb });
      });
    })
    .catch((reason) => {
      console.log('Request failed due to');
      console.log(reason);
    })
    .finally(() => setIsProteinLoading(false));  
}

settingsStore.subscribe(loadProtein);

initializeModule('protein');

const onInitAll = () => {
  loadProtein(settingsStore.getState());
};

subscribeToInitAll(onInitAll);
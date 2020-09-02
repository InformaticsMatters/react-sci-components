import { StatePiece, WorkingSourceState } from 'components/dataLoader/sources';
import { useRedux } from 'hooks-for-redux';
import isEqual from 'lodash/isEqual';
import DataTierAPI from 'services/DataTierAPI';

import { initializeModule } from '../state/stateConfig';
import { resolveState } from '../state/stateResolver';

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

let prevSource: StatePiece | null = null;

const loadProtein = async (workingSources: WorkingSourceState) => {
  const state = workingSources.find((slice) => slice.title === 'pdb')?.state ?? null;
  if (state === null || isEqual(prevSource, state)) return;

  prevSource = state;

  const { projectId, datasetId } = state;

  try {
    setIsProteinLoading(true);
    const dataset = await DataTierAPI.downloadDatasetFromProjectAsJSON(projectId, datasetId);

  } catch (error) {
    const err = error as Error;
    console.log(err);
  } finally {
    setIsProteinLoading(false);
  }

  // if (proteinPath !== '') {
  //   setIsProteinLoading(true);
  //   const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  //   try {
  //     const resp = await fetch(proxyurl + proteinPath, { mode: 'cors' });
  //     const pdb = await resp.text();
  //     // console.log(pdb);
  //     setProtein({ definition: pdb });
  //   } catch (reason) {
  //     console.log('Request failed due to');
  //     console.log(reason);
  //   } finally {
  //     setIsProteinLoading(false);
  //   }
  // }
};

// workingSourceStore.subscribe(loadProtein);

initializeModule('protein');

// const onInitAll = async () => {
//   await loadProtein(settingsStore.getState());
// };

// subscribeToAllInit(onInitAll);

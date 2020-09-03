import { StatePiece, WorkingSourceState, workingSourceStore } from 'components/dataLoader/sources';
import { useRedux } from 'hooks-for-redux';
import isEqual from 'lodash/isEqual';
import DataTierAPI from 'services/DataTierAPI';

import { initializeModule, subscribeToAllInit } from '../state/stateConfig';
import { resolveState } from '../state/stateResolver';

export interface Protein {
  definition: string;
}

export interface ProteinState {
  protein: Protein;
  isProteinLoading: boolean;
  proteinErrorMessage: string | null;
}

export const initialState: ProteinState = {
  protein: { definition: '' },
  isProteinLoading: false,
  proteinErrorMessage: null,
};

export const [useProtein, { setProtein, setIsProteinLoading, setErrorMessage }, proteinStore] = useRedux(
  'protein',
  resolveState('protein', initialState),
  {
    setProtein: (state, protein: Protein) => ({ ...state, protein }),
    setIsProteinLoading: (state, isProteinLoading: boolean) => ({ ...state, isProteinLoading }),
    setErrorMessage: (state, proteinErrorMessage: string | null) => ({
      ...state,
      proteinErrorMessage,
    }),
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
    setErrorMessage(null);
    const dataset = await DataTierAPI.downloadDatasetFromProjectAsNative(projectId, datasetId);
    setProtein({ definition: dataset });
  } catch (error) {
    const err = error as Error;
    if (err.message) {
      setErrorMessage(err.message)
    }
  } finally {
    setIsProteinLoading(false);
  }
};

workingSourceStore.subscribe(loadProtein);

initializeModule('protein');

const onInitAll = async () => {
  await loadProtein(workingSourceStore.getState());
};

subscribeToAllInit(onInitAll);

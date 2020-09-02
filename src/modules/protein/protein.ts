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
    const dataset = await DataTierAPI.downloadDatasetFromProjectAsNative(projectId, datasetId);
    setProtein({ definition: dataset });
  } catch (error) {
    const err = error as Error;
    console.log(err);
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

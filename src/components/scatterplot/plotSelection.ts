import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';
import { initializeModule, isStateLoadingFromFile } from '../../modules/state/stateConfig';
import { resolveState } from '../../modules/state/stateResolver';

const initialState: number[] = []; // ids of selected molecules

export const [usePlotSelection, { selectPoints }, plotSelectionStore] = useRedux(
  'plotSelection',
  resolveState('plotSelection', initialState),
  {
    selectPoints: (_, newSelection: number[]) => newSelection,
  },
);

moleculesStore.subscribe(() => {
  if (!isStateLoadingFromFile()) {
    selectPoints([]);
  }
});

initializeModule('plotSelection');

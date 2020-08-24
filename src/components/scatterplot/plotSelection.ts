import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';
import { resolveState } from '../../modules/state/stateResolver';
import {initializeModule} from '../../modules/state/stateConfig';


const initialState: number[] = []; // ids of selected molecules

export const [usePlotSelection, { selectPoints }, plotSelectionStore] = useRedux(
  'plotSelection',
  resolveState('plotSelection', initialState),
  {
    selectPoints: (_, newSelection: number[]) => newSelection,
  },
);

moleculesStore.subscribe((molecules) => {
  selectPoints([]);
});

initializeModule('plotSelection');

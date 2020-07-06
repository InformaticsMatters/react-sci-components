import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';

const initialState: number[] = []; // ids of selected molecules

export const [usePlotSelection, { selectPoints }, plotSelectionStore] = useRedux(
  'plotSelection',
  initialState,
  {
    selectPoints: (_, newSelection: number[]) => newSelection,
  },
);

moleculesStore.subscribe((molecules) => {
  selectPoints([]);
});

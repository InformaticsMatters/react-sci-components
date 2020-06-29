import { useRedux } from 'hooks-for-redux';
import { moleculesStore, Molecule } from '../../modules/molecules/molecules';

const initialState: Molecule[] = [];

export const [usePlotSelection, { selectPoints }, plotSelectionStore] = useRedux(
    'plotSelection',
    initialState,
    {
        //selectMolecules: (moleculesSelection, newSelection) => moleculesSelection = newSelection
        selectPoints: (moleculesSelection, newSelection: Molecule[]) => {
            return newSelection;
        },
    },
);

moleculesStore.subscribe((molecules) => {
    selectPoints([]);
});

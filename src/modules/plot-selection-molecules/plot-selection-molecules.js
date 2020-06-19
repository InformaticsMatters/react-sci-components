import { useRedux } from "hooks-for-redux";
import {moleculesStore} from '../molecules/molecules'

const initialState = [];

export const [useMoleculesSelection, {selectMolecules}, moleculeSelectionStore] = useRedux(
    "moleculesSelection",
    initialState,
    {
        selectMolecules: (moleculesSelection, newSelection) => moleculesSelection = newSelection
    }
);

moleculesStore.subscribe((molecules) => {
    selectMolecules([]);
});

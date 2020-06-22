import { useRedux } from "hooks-for-redux";
import {moleculesStore} from '../../modules/molecules/molecules'

const initialState = [];

export const [usePlotSelection, {selectPoints}, plotSelectionStore] = useRedux(
    "plotSelection",
    initialState,
    {
        //selectMolecules: (moleculesSelection, newSelection) => moleculesSelection = newSelection
        selectPoints: (moleculesSelection, newSelection) => {
            return newSelection;
        }
    }
);

moleculesStore.subscribe((molecules) => {
    selectPoints([]);
});

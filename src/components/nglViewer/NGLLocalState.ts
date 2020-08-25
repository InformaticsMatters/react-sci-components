import { useRedux } from 'hooks-for-redux';
import {NGL_PARAMS, BACKGROUND_COLOR} from './Constants';
import {CardActionsState, cardActionsStore} from '../cardView/cardActions';
import { resolveState } from '../../modules/state/stateResolver';
import {initializeModule} from '../../modules/state/stateConfig';


export interface NGLLocalState {
    nglOrientations: any;
    viewParams: any;
    molsInView: number[];
    firstTimeShowLigand: boolean;
}

export const initialState: NGLLocalState = {
    nglOrientations: {},
    viewParams: {
        [NGL_PARAMS.backgroundColor]: BACKGROUND_COLOR.white,
        [NGL_PARAMS.clipNear]: 42,
        [NGL_PARAMS.clipFar]: 100,
        [NGL_PARAMS.clipDist]: 10,
        [NGL_PARAMS.fogNear]: 50,
        [NGL_PARAMS.fogFar]: 62        
    },
    molsInView: [],
    firstTimeShowLigand: true,
};

export const [
    useNGLLocalState,
    {removeAllNglComponents, setNglOrientation, setMoleculesToView, setfirstTimeShowLigand},
    nglLoacalStateSTore
] = useRedux('nglLocalState', resolveState('nglLocalState', initialState), {
    removeAllNglComponents: (state, stage: any) => {
        stage.removeAllComponents();
        return {...state, initialState};
    },
    setNglOrientation: (state, orientationInfo: any) => {
        const div_id = orientationInfo.div_id;
        const orientation = orientationInfo.orientation;
        const toSetDiv = JSON.parse(JSON.stringify(state.nglOrientations));
        toSetDiv[div_id] = orientation;
        return {...state, nglOrientations: toSetDiv};
    },
    setMoleculesToView: (state, molecules: number[]) => {
        return {...state, molsInView: molecules ? molecules : []};
    },
    setfirstTimeShowLigand: (state, firstTime: boolean) => {
        return {...state, firstTimeShowLigand: firstTime};
    }
});

cardActionsStore.subscribe((state: CardActionsState) => {
    setMoleculesToView(state.isInNGLViewerIds);
});

initializeModule('nglLocalState');
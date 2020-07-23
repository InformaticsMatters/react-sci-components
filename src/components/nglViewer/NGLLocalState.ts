import { useRedux } from 'hooks-for-redux';
import {NGL_PARAMS, BACKGROUND_COLOR} from './Constants';
import {ProteinState, proteinStore} from '../../modules/protein/protein';

export interface ViewListItem {
    id: string;
    stage: any;
}

export interface NGLLocalState {
    viewList: ViewListItem[],
    stage: any,
    nglOrientations: any,
    objectsInView: any,
    viewParams: any,
    protein: string
}

export const initialState: NGLLocalState = {
    viewList: [],
    stage: undefined,
    nglOrientations: {},
    objectsInView: {},
    viewParams: {
        [NGL_PARAMS.backgroundColor]: BACKGROUND_COLOR.black,
        [NGL_PARAMS.clipNear]: 42,
        [NGL_PARAMS.clipFar]: 100,
        [NGL_PARAMS.clipDist]: 10,
        [NGL_PARAMS.fogNear]: 50,
        [NGL_PARAMS.fogFar]: 62        
    },
    protein: ""
};

export const [
    useNGLLocalState,
    {setNglViewList, setStage, removeAllNglComponents, setNglOrientation, setProtein},
    nglLoacalStateSTore
] = useRedux('nglLocalState', initialState, {
    setNglViewList: (state, viewList: ViewListItem[]) => ({...state, viewList: viewList}),
    setStage: (state, stage: any) => ({...state, stage}),
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
    setProtein: (state, protein: string) => {
        return {...state, protein: protein};
    }
});

proteinStore.subscribe((state: ProteinState) => {
    if (state.protein && state.protein.definition && state.protein.definition.trim() !== '') {
        setProtein(state.protein.definition);
    };
});
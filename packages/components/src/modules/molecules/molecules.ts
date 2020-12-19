import { useRedux } from 'hooks-for-redux';

import { dTypes } from '../../components/dataLoader/workingSource';
import { resolveState } from '../state/stateResolver';

export interface Field {
  name: string;
  nickname?: string;
  value: string | number | null;
}

export interface Molecule {
  id: number;
  fields: Field[];
  molFile: string;
}

export interface FieldMeta {
  dtype: dTypes;
  name: string;
  nickname: string;
  enabled: boolean;
}

export interface MoleculesState {
  datasetId: string | null;
  molecules: Molecule[];
  totalParsed?: number;
  fields: FieldMeta[];
  isMoleculesLoading: boolean;
  moleculesErrorMessage: string | null;
}

const initialState: MoleculesState = {
  datasetId: null,
  molecules: [],
  fields: [],
  isMoleculesLoading: false,
  moleculesErrorMessage: null,
};

export const [
  useMolecules,
  { mergeNewMoleculesState, setIsMoleculesLoading, setMoleculesErrorMessage, setTotalParsed },
  moleculesStore,
] = useRedux('molecules', resolveState('molecules', initialState), {
  mergeNewMoleculesState: (state, newState: Partial<MoleculesState>) => ({ ...state, ...newState }),
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({ ...state, isMoleculesLoading }),
  setMoleculesErrorMessage: (state, moleculesErrorMessage: string | null) => ({
    ...state,
    moleculesErrorMessage,
  }),
  setTotalParsed: (state, totalParsed: number) => ({ ...state, totalParsed }),
});

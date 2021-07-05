import { useRedux } from 'hooks-for-redux';

import { resolveState } from '../state/stateResolver';

export interface Protein {
  definition: string;
}

export interface ProteinState {
  protein: Protein;
  isProteinLoading: boolean;
  proteinErrorMessage: string | null;
}

const initialState: ProteinState = {
  protein: { definition: '' },
  isProteinLoading: false,
  proteinErrorMessage: null,
};

export const [
  useProtein,
  { setProtein, setIsProteinLoading, setProteinErrorMessage },
  proteinStore,
] = useRedux('protein', resolveState('protein', initialState), {
  setProtein: (state, protein: Protein) => ({ ...state, protein }),
  setIsProteinLoading: (state, isProteinLoading: boolean) => ({
    ...state,
    isProteinLoading,
  }),
  setProteinErrorMessage: (state, proteinErrorMessage: string | null) => ({
    ...state,
    proteinErrorMessage,
  }),
});

import { useRedux } from 'hooks-for-redux';

const initialState = {
  proteinPath: '',
  moleculesPath: '',
};

export const [useSettings, { setProteinPath, setMoleculesPath }, settingsStore] = useRedux(
  'settings',
  initialState,
  {
    setProteinPath: (settings, proteinPathPar) =>
      Object.assign({}, settings, { proteinPath: proteinPathPar }),
    setMoleculesPath: (settings, moleculesPathPar) =>
      Object.assign({}, settings, { moleculesPath: moleculesPathPar }),
  },
);

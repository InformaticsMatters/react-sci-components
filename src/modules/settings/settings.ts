import { useRedux } from 'hooks-for-redux';

const initialState = {
  proteinPath: '',
  moleculesPath: '',
};

export const [useSettings, { setSettings, setProteinPath, setMoleculesPath }, settingsStore] = useRedux(
  'settings',
  initialState,
  {
    setSettings: (settings, newSettings) => 
      newSettings,
    setProteinPath: (settings, proteinPathPar) =>
      Object.assign({}, settings, { proteinPath: proteinPathPar }),
    setMoleculesPath: (settings, moleculesPathPar) =>
      Object.assign({}, settings, { moleculesPath: moleculesPathPar }),
  },
);

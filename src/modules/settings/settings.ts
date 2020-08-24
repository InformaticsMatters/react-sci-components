import { useRedux } from 'hooks-for-redux';

import { resolveState } from '../state/stateResolver';
import {initializeModule} from '../state/stateConfig';


const initialState = {
  proteinPath: '',
  moleculesPath: '',
};

export const [
  useSettings,
  { setSettings, setProteinPath, setMoleculesPath },
  settingsStore,
] = useRedux('settings', resolveState('settings', initialState), {
  setSettings: (_, newSettings) => newSettings,
  setProteinPath: (settings, proteinPathPar) =>
    Object.assign({}, settings, { proteinPath: proteinPathPar }),
  setMoleculesPath: (settings, moleculesPathPar) =>
    Object.assign({}, settings, { moleculesPath: moleculesPathPar }),
});

initializeModule('settings');

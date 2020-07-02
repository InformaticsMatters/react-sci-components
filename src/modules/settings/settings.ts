import { useRedux } from 'hooks-for-redux';

const initialState = {
  proteinPath: '',
  moleculesPath: '',
  xprop: 'TransFSScore',
  yprop: 'SuCOS_Score',
  color: 'red',
  size: '',
};

export const [
  useSettings,
  { setProteinPath, setMoleculesPath, setXProp, setYProp, setColor, setSize },
  settingsStore,
] = useRedux('settings', initialState, {
  setProteinPath: (settings, proteinPathPar) =>
    Object.assign({}, settings, { proteinPath: proteinPathPar }),
  setMoleculesPath: (settings, moleculesPathPar) =>
    Object.assign({}, settings, { moleculesPath: moleculesPathPar }),
  setXProp: (settings, xpropPar) => Object.assign({}, settings, { xprop: xpropPar }),
  setYProp: (settings, ypropPar) => Object.assign({}, settings, { yprop: ypropPar }),
  setColor: (settings, colorPar) => Object.assign({}, settings, { color: colorPar }),
  setSize: (settings, sizePar) => Object.assign({}, settings, { size: sizePar }),
});

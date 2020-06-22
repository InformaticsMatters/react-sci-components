import { useRedux } from "hooks-for-redux";

export const [
    useSettings, 
    {setProteinPath, setMoleculesPath, setXProp, setYProp, setColor, setSize},
     settingsStore
    ] = useRedux(
    "settings",
    {proteinPath: '', moleculesPath: '', xprop: 'score1', yprop: 'score2', color: 'red', size: ''},
    {
        setProteinPath: (settings, proteinPathPar) => Object.assign(settings, {proteinPath: proteinPathPar}),
        setMoleculesPath: (settings, moleculesPathPar) => Object.assign(settings, {moleculesPath: moleculesPathPar}),
        setXProp: (settings, xpropPar) => Object.assign(settings, {xprop: xpropPar}),
        setYProp: (settings, ypropPar) => Object.assign(settings, {yprop: ypropPar}),
        setColor: (settings, colorPar) => Object.assign(settings, {color: colorPar}),
        setSize: (settings, sizePar) => Object.assign(settings, {size: sizePar})
    }
);
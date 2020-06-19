import { useRedux } from "hooks-for-redux";

export const [useSettings, {setProteinPath, setMoleculesPath, setXProp, setYProp, setColor, setSize}, settingsStore] = useRedux(
    "settings",
    {proteinPath: '', moleculesPath: '', xprop: 'score1', yprop: 'score2', color: 'red', size: ''},
    {
        setProteinPath: (settings, proteinPath) => settings.proteinPath = proteinPath,
        setMoleculesPath: (settings, moleculesPath) => settings.moleculesPath = moleculesPath,
        setXProp: (settings, xprop) => settings.xprop = xprop,
        setYProp: (settings, yprop) => settings.yprop = yprop,
        setColor: (settings, color) => settings.color = color,
        setSize: (settings, size) => settings.size = size
    }
);
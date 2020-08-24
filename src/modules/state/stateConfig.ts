export const doNotSerialize = new Set(['molecules', 'protein']);
const callbackAllModulesInitialized:{(): void;}[] = [];

const moduleInitializationStatus = {
    cardActions: false,
    cardViewConfiguration: false,
    sources: false,
    workingSource: false,
    nglLocalState: false,
    plotConfiguration: false,
    plotSelection: false,
    molecules: false,
    protein: false,
    settings: false,
};

export const initializeModule = (moduleName: keyof typeof moduleInitializationStatus) => {
    moduleInitializationStatus[moduleName] = true;
    if (areAllModulesInitialized()) {
        localStorage.clear();
        onInitiAll();
    };
};

const areAllModulesInitialized = (): boolean => {
    let result: boolean = true;

    (Object.keys(moduleInitializationStatus) as Array<keyof typeof moduleInitializationStatus>).forEach(key => {
        result = result && moduleInitializationStatus[key];
    })

    return result;
};

export const subscribeToInitAll = (callback:()=>void) => {
    callbackAllModulesInitialized.push(callback);
};

const onInitiAll = () => {
    callbackAllModulesInitialized.forEach(callback => callback());
};
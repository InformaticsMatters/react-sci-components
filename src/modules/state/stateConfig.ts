export const doNotSerialize = new Set(['molecules', 'protein']);
const callbackAllModulesInitialized:{(): Promise<void>;}[] = [];

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
        onInitiAll().then(() => {
            localStorage.clear()
        });
    };
};

const areAllModulesInitialized = (): boolean => {
    let result: boolean = true;

    (Object.keys(moduleInitializationStatus) as Array<keyof typeof moduleInitializationStatus>).forEach(key => {
        result = result && moduleInitializationStatus[key];
    })

    return result;
};

export const isBeingStateReloadedFromFile = (): boolean => {
    return localStorage.getItem('state') !== null;
}

export const subscribeToInitAll = (callback:()=>Promise<void>) => {
    callbackAllModulesInitialized.push(callback);
};

const onInitiAll = async () => {
    //callbackAllModulesInitialized.forEach(callback => callback());
    for (let i = 0; i < callbackAllModulesInitialized.length; i++) {
        let callback = callbackAllModulesInitialized[i];
        await callback();
    };
};
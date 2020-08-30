export const doNotSerialize = new Set(['molecules', 'protein']);

type InitialisationCallback = () => Promise<void>;

const callbackAllModulesInitialised: InitialisationCallback[] = [];

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

export const initializeModule = async (moduleName: keyof typeof moduleInitializationStatus) => {
  moduleInitializationStatus[moduleName] = true;
  if (areAllModulesInitialized()) {
    await onAllInit();
    localStorage.clear();
  }
};

const areAllModulesInitialized = (): boolean => {
  return Object.values(moduleInitializationStatus).every((b) => b);
};

export const isBeingStateReloadedFromFile = (): boolean => {
  return localStorage.getItem('state') !== null;
};

export const subscribeToAllInit = (callback: () => Promise<void>) => {
  callbackAllModulesInitialised.push(callback);
};

const onAllInit = async () => {
  for (let callback of callbackAllModulesInitialised) {
    await callback();
  }
};

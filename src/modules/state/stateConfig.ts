export const doNotSerialize = new Set(['molecules', 'protein']);
export const STATE_KEY = 'poseViewerState';

type InitialisationCallback = () => Promise<void>;

const callbackAllModulesInitialised: InitialisationCallback[] = [];

const moduleInitializationStatus = {
  cardActions: false,
  cardViewConfiguration: false,
  // sources: false,
  workingSource: false,
  nglLocalState: false,
  plotConfiguration: false,
  plotSelection: false,
  molecules: false,
  protein: false,
};

export const initializeModule = async (moduleName: keyof typeof moduleInitializationStatus) => {
  moduleInitializationStatus[moduleName] = true;
  if (areAllModulesInitialized()) {
    await onAllInit();
    localStorage.removeItem(STATE_KEY);
  }
};

const areAllModulesInitialized = () => {
  return Object.values(moduleInitializationStatus).every((b) => b);
};

export const isBeingStateReloadedFromFile = () => {
  return localStorage.getItem(STATE_KEY) !== null;
};

export const subscribeToAllInit = (callback: () => Promise<void>) => {
  callbackAllModulesInitialised.push(callback);
};

const onAllInit = async () => {
  for (let callback of callbackAllModulesInitialised) {
    await callback();
  }
};

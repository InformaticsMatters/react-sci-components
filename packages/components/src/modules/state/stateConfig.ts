import { DataTierAPI } from '@squonk/data-tier-services';

export const doNotSerialize = new Set(['molecules', 'protein']);
export const STATE_KEY = 'poseViewerState';

type InitialisationCallback = () => Promise<void>;

const callbackAllModulesInitialised: InitialisationCallback[] = [];

const moduleInitializationStatus = {
  cardActions: false,
  cardViewConfiguration: false,
  workingSource: false,
  sourceConfigs: false,
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
  }
};

const areAllModulesInitialized = () => {
  return Object.values(moduleInitializationStatus).every((b) => b);
};

export const isStateLoadingFromFile = () => {
  return localStorage.getItem(STATE_KEY) !== null;
};

export const subscribeToAllInit = (callback: () => Promise<void>) => {
  callbackAllModulesInitialised.push(callback);
};

const onAllInit = async () => {
  // Wait until were authenticated before trying to restore modules that use protected APIs
  const id = setInterval(async () => {
    if (DataTierAPI.hasToken()) {
      clearInterval(id);
      for (let callback of callbackAllModulesInitialised) {
        await callback();
      }
      localStorage.removeItem(STATE_KEY);
    }
  }, 100);
};

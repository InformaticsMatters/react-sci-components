import { useRedux } from 'hooks-for-redux';
import DataTierAPI from 'services/DataTierAPI';

import {
  dTypes,
  WorkingSourceState,
  workingSourceStore,
} from '../../components/dataLoader/sources';
import { initializeModule, subscribeToAllInit } from '../state/stateConfig';
import { resolveState } from '../state/stateResolver';

export interface Field {
  name: 'oclSmiles' | string;
  nickname?: string;
  value: number | string;
}

export interface Molecule {
  id: number;
  fields: Field[];
  molFile: string;
}

export interface MoleculesState {
  molecules: Molecule[];
  totalParsed?: number;
  fieldNames: string[];
  fieldNickNames: string[];
  enabledFieldNames?: string[];
}

const initialState: MoleculesState = {
  molecules: [],
  fieldNames: [],
  fieldNickNames: [],
};

export const [
  useMolecules,
  { mergeNewState, setIsMoleculesLoading, setMoleculesErrorMessage, setTotalParsed },
  moleculesStore,
] = useRedux('molecules', resolveState('molecules', initialState), {
  mergeNewState: (state, newState: Partial<MoleculesState>) => ({ ...state, ...newState }),
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({
    ...state,
    isMoleculesLoading,
  }),
  setMoleculesErrorMessage: (state, moleculesErrorMessage: string | null) => ({
    ...state,
    moleculesErrorMessage,
  }),
  setTotalParsed: (state, totalParsed: number) => ({ ...state, totalParsed }),
});

const loadMolecules = async (state: WorkingSourceState) => {
  if (state === null) return;

  const { projectId, datasetId, maxRecords, configs } = state;

  setIsMoleculesLoading(true);

  try {
    const dataset = await DataTierAPI.downloadDatasetFromProjectAsJSON(projectId, datasetId);

    const molecules: Molecule[] = [];
    let totalParsed = 0;
    for (const mol of dataset) {
      if (maxRecords !== undefined && molecules.length >= maxRecords) break;

      const values = Object.entries(mol.values);
      let valid = true;
      for (let config of configs) {
        if (config.dtype !== dTypes.TEXT) {
          for (const [, value] of values) {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
              valid = false;
              break;
            }

            if (config?.min && numericValue < config.min) {
              valid = false;
              break;
            }
            if (config?.max && numericValue > config.max) {
              valid = false;
              break;
            }
          }
          if (!valid) break;
        }
      }
      // TODO: Add defaultValue
      // TODO: Apply nickname transforms
      if (valid)
        molecules.push({
          id: totalParsed,
          fields: values.map(([name, value]) => ({ name, value })),
          molFile: mol.molecule.molblock ?? '', // TODO: handle missing molblock with display of error msg
        });
      totalParsed++;
    }
    mergeNewState({ molecules, totalParsed, fieldNames: configs.map(({ name }) => name) });
  } catch (error) {
    console.info({ error });
    const err = error as Error;
    setMoleculesErrorMessage(err.message || 'An unknown error occurred');
    setTotalParsed(0);
  } finally {
    setIsMoleculesLoading(false);
  }
};

workingSourceStore.subscribe(loadMolecules);

initializeModule('molecules');

const onInitAll = async () => {
  await loadMolecules(workingSourceStore.getState());
};

subscribeToAllInit(onInitAll);

import { useRedux } from 'hooks-for-redux';
import isEqual from 'lodash/isEqual';
import DataTierAPI from 'services/DataTierAPI';

import {
  dTypes,
  StatePiece,
  WorkingSourceState,
  workingSourceStore,
} from '../../components/dataLoader/sources';
import { initializeModule, subscribeToAllInit } from '../state/stateConfig';
import { resolveState } from '../state/stateResolver';

export interface Field {
  name: string;
  nickname?: string;
  value: string | number;
}

export interface Molecule {
  id: number;
  fields: Field[];
  molFile: string;
}

export interface FieldMeta {
  dtype: dTypes;
  name: string;
  nickname: string;
  enabled: boolean;
}

export interface MoleculesState {
  molecules: Molecule[];
  totalParsed?: number;
  fields: FieldMeta[];
  moleculesErrorMessage: string | null;
}

const initialState: MoleculesState = {
  molecules: [],
  fields: [],
  moleculesErrorMessage: null,
};

export const [
  useMolecules,
  { mergeNewState, setMoleculesErrorMessage, setTotalParsed },
  moleculesStore,
] = useRedux('molecules', resolveState('molecules', initialState), {
  mergeNewState: (state, newState: Partial<MoleculesState>) => ({ ...state, ...newState }),
  setMoleculesErrorMessage: (state, moleculesErrorMessage: string | null) => ({
    ...state,
    moleculesErrorMessage,
  }),
  setTotalParsed: (state, totalParsed: number) => ({ ...state, totalParsed }),
});

let prevSource: StatePiece | null = null;

const loadMolecules = async (workingSources: WorkingSourceState) => {
  const state = workingSources.find((slice) => slice.title === 'sdf')?.state ?? null;
  if (state === null || isEqual(prevSource, state)) return;

  prevSource = state;

  const { projectId, datasetId, maxRecords, configs } = state;

  try {
    const dataset = await DataTierAPI.downloadDatasetFromProjectAsJSON(projectId, datasetId);

    const molecules: Molecule[] = [];
    let totalParsed = 0;
    for (const mol of dataset) {
      if (maxRecords !== undefined && molecules.length >= maxRecords) break;

      const values = Object.entries(mol.values);
      let valid = true;
      for (let config of configs ?? []) {
        const [, value] = values.find(([name]) => config.name === name)!;
        if (config.dtype !== dTypes.TEXT) {
          const numericValue = parseFloat(value);
          if (isNaN(numericValue)) {
            valid = false;
            break;
          }

          if (config?.min !== undefined && numericValue < config.min) {
            valid = false;
            break;
          }
          if (config?.max !== undefined && numericValue > config.max) {
            valid = false;
            break;
          }
          if (!valid) break;
        }
      }
      // TODO: Add defaultValue
      // TODO: Apply nickname transforms
      if (valid)
        molecules.push({
          id: totalParsed,
          fields: values.map(([name, value]) => {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
              return { name, nickname: name, value };
            } else {
              return { name, nickname: name, value: numericValue };
            }
          }),
          molFile: mol.molecule.molblock ?? '', // TODO: handle missing molblock with display of error msg
        });
      totalParsed++;
    }

    mergeNewState({
      molecules,
      totalParsed,
      fields: (configs ?? []).map(({ name, nickname, dtype }) => ({
        name,
        nickname: nickname || name,
        dtype,
        enabled: true,
      })),
    });
  } catch (error) {
    console.info({ error });
    const err = error as Error;
    setMoleculesErrorMessage(err.message || 'An unknown error occurred');
    setTotalParsed(0);
  } finally {
  }
};

workingSourceStore.subscribe(loadMolecules);

initializeModule('molecules');

const onInitAll = async () => {
  await loadMolecules(workingSourceStore.getState());
};

subscribeToAllInit(onInitAll);

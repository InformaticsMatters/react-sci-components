import { useRedux } from 'hooks-for-redux';
import { SDFileParser } from 'openchemlib/minimal';
import { ungzip } from 'pako';
import { isNumeric } from 'utils';
import { resolveState } from '../state/stateResolver';

import { Source, workingSourceStore } from '../../components/dataLoader/sources';

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
  isMoleculesLoading: boolean;
  moleculesErrorMessage: string | null;
  molecules: Molecule[];
  totalParsed?: number;
  fieldNames: string[];
  fieldNickNames: string[];
  enabledFieldNames?: string[];
}

const initialState: MoleculesState = {
  isMoleculesLoading: false,
  moleculesErrorMessage: null,
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

const parseSDF = (sdf: string, { maxRecords = Infinity, configs }: Omit<Source, 'url' | 'id'>) => {
  const readMolecules: Molecule[] = [];

  // TODO: can we specify the field we use with the second arg?
  const parser = new SDFileParser(sdf, null!);
  const fieldNames = parser.getFieldNames(1);

  const enabledFieldNames = fieldNames.filter(
    (name) => configs.find((config) => config.name === name)?.enabled !== false, // ?
  );

  const configLookup = Object.fromEntries(
    fieldNames.map((name) => [name, configs.find((config) => config.name === name)]),
  );

  let counter = 0;
  let totalCounter = 0;
  while (parser.next() && counter < maxRecords) {
    const sdfMolecule = parser.getMolecule();
    const currentMolFile = sdfMolecule.toMolfile();
    const smiles = sdfMolecule.toIsomericSmiles();
    const fields: Field[] = [{ name: 'oclSmiles', value: smiles }];

    let valid = true;
    enabledFieldNames.forEach((name) => {
      const fieldValue = parser.getField(name);
      const config = configLookup[name];
      let value;
      if (isNumeric(fieldValue)) {
        value = parseFloat(fieldValue);
        if (config?.min && value < config.min) {
          valid = false;
        }
        if (config?.max && value > config.max) {
          valid = false;
        }
      } else {
        value = fieldValue;
      }
      fields.push({ name, nickname: config?.nickname || name, value });
    });

    if (valid) {
      readMolecules.push({
        id: counter,
        molFile: currentMolFile,
        fields: fields,
      });
      counter++;
    }
    totalCounter++;
  }
  fieldNames.unshift('oclSmiles');
  enabledFieldNames.unshift('oclSmiles');
  const fieldNickNames = fieldNames.map(
    (name) => configs.find((config) => config.name === name)?.nickname || name,
  );

  return [readMolecules, totalCounter, fieldNames, fieldNickNames, enabledFieldNames] as const;
};

workingSourceStore.subscribe(async ({ url, ...restOfSource }) => {
  setIsMoleculesLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  const paramIndex = url.indexOf('?');
  const moleculesPath = paramIndex !== -1 ? url.slice(0, paramIndex) : url;

  try {
    const resp = await fetch(proxyurl + url, {
      mode: 'cors',
      headers: { origin: '0.0.0.0' }, // Need to specify an origin header in order for Dropbox to work
    });

    // Fetch API doesn't throw an error when there is one
    if (!resp.ok) {
      throw new Error();
    }

    if (moleculesPath.endsWith('.sdf')) {
      const txt = await resp.text();
      const [readMolecules, totalCounter, fieldNames, fieldNickNames, enabledFieldNames] = parseSDF(
        txt,
        restOfSource,
      );
      mergeNewState({
        molecules: readMolecules,
        totalParsed: totalCounter,
        fieldNames,
        fieldNickNames,
        enabledFieldNames,
        moleculesErrorMessage: null,
      });
    } else if (moleculesPath.endsWith('gzip') || moleculesPath.endsWith('gz')) {
      const buffer = await resp.arrayBuffer();
      console.debug(buffer);
      const unzipped = ungzip(new Uint8Array(buffer));
      let txt = '';
      for (let i of unzipped) {
        txt += String.fromCharCode(i);
      }

      const [readMolecules, totalCounter, fieldNames, fieldNickNames, enabledFieldNames] = parseSDF(
        txt,
        restOfSource,
      );
      mergeNewState({
        molecules: readMolecules,
        totalParsed: totalCounter,
        fieldNames,
        fieldNickNames,
        enabledFieldNames,
        moleculesErrorMessage: null,
      });
    }
  } catch (error) {
    console.info({ error });
    const err = error as Error;
    setMoleculesErrorMessage(err.message || 'An unknown error occurred');
    setTotalParsed(0);
  } finally {
    setIsMoleculesLoading(false);
  }
});

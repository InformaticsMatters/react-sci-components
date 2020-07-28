import { useRedux } from 'hooks-for-redux';
import { SDFileParser } from 'openchemlib/minimal';
import { ungzip } from 'pako';
import { isNumeric } from 'utils';

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
  molecules: Molecule[];
  fieldNames: string[];
  fieldNickNames: string[];
}

const initialState: MoleculesState = {
  isMoleculesLoading: false,
  molecules: [],
  fieldNames: [],
  fieldNickNames: [],
};

export const [
  useMolecules,
  { setIsMoleculesLoading, setMolecules, setFieldNames, setFieldNickNames },
  moleculesStore,
] = useRedux('molecules', initialState, {
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({
    ...state,
    isMoleculesLoading,
  }),
  setMolecules: (state, molecules: Molecule[]) => ({ ...state, molecules }),
  setFieldNames: (state, fieldNames: string[]) => ({ ...state, fieldNames }),
  setFieldNickNames: (state, fieldNickNames: string[]) => ({ ...state, fieldNickNames }),
});

const parseSDF = (sdf: string, { maxRecords = Infinity, configs }: Omit<Source, 'url' | 'id'>) => {
  const readMolecules: Molecule[] = [];
  // Types for openchemlib are missing strict null checks so need 'null as any' here
  // TODO: can we specify the field we use with the second arg?
  const parser = new SDFileParser(sdf, null!);
  const fieldNames = parser.getFieldNames(1);

  const configLookup = Object.fromEntries(
    fieldNames.map((name) => [name, configs.find((config) => config.name === name)]),
  );

  let counter = 0;
  while (parser.next() && counter <= maxRecords) {
    const sdfMolecule = parser.getMolecule();
    const currentMolFile = sdfMolecule.toMolfile();
    const smiles = sdfMolecule.toIsomericSmiles();
    const fields: Field[] = [{ name: 'oclSmiles', value: smiles }];

    let valid = true;
    fieldNames.forEach((name) => {
      const fieldValue = parser.getField(name);
      const config = configLookup[name];
      let value;
      if (isNumeric(fieldValue)) {
        value = parseFloat(fieldValue);
        if (config?.min && config?.max && (value < config.min || value > config.max)) {
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
  }
  fieldNames.unshift('oclSmiles');
  const fieldNickNames = fieldNames.map(
    (name) => configs.find((config) => config.name === name)?.nickname || name,
  );

  return [readMolecules, fieldNames, fieldNickNames] as const;
};

workingSourceStore.subscribe(async ({ url: moleculesPath, ...restOfSource }) => {
  setIsMoleculesLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  const resp = await fetch(proxyurl + moleculesPath, { mode: 'cors' });

  if (moleculesPath.endsWith('.sdf')) {
    const txt = await resp.text();
    const [readMolecules, fieldNames, fieldNickNames] = parseSDF(txt, restOfSource);
    setMolecules(readMolecules);
    setFieldNames(fieldNames);
    setFieldNickNames(fieldNickNames);
  } else if (moleculesPath.endsWith('gzip') || moleculesPath.endsWith('gz')) {
    const buffer = await resp.arrayBuffer();
    const unzipped = ungzip(new Uint8Array(buffer));
    let txt = '';
    for (let i of unzipped) {
      txt += String.fromCharCode(i);
    }

    const [readMolecules, fieldNames, fieldNickNames] = parseSDF(txt, restOfSource);
    setMolecules(readMolecules);
    setFieldNames(fieldNames);
    setFieldNickNames(fieldNickNames);
  }

  setIsMoleculesLoading(false);
});

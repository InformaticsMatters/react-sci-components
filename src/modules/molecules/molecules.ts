import { useRedux } from 'hooks-for-redux';
import { SDFileParser } from 'openchemlib/minimal';
import { ungzip } from 'pako';

import { settingsStore } from '../settings/settings';
import { isNumeric } from 'utils';

export type Field = { name: 'oclSmiles' | string; value: number | string };

export interface Molecule {
  id: number;
  fields: Field[];
  molFile: string;
}

export interface MoleculesState {
  isMoleculesLoading: boolean;
  molecules: Molecule[];
  fieldNames: string[];
}

const initialState: MoleculesState = {
  isMoleculesLoading: false,
  molecules: [],
  fieldNames: [],
};

export const [
  useMolecules,
  { setIsMoleculesLoading, setMolecules, setFieldNames },
  moleculesStore,
] = useRedux('molecules', initialState, {
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({
    ...state,
    isMoleculesLoading,
  }),
  setMolecules: (state, molecules: Molecule[]) => ({ ...state, molecules }),
  setFieldNames: (state, fieldNames: string[]) => ({ ...state, fieldNames }),
});

const parseSDF = (sdf: string) => {
  const readMolecules: Molecule[] = [];
  // Types for openchemlib are missing strict null checks so need 'null as any' here
  // TODO: can we specify the field we use with the second arg?
  const parser = new SDFileParser(sdf, null!);
  const fieldNames = parser.getFieldNames(1);
  let counter = 0;
  while (parser.next()) {
    const sdfMolecule = parser.getMolecule();
    const currentMolFile = sdfMolecule.toMolfile();
    const smiles = sdfMolecule.toIsomericSmiles();
    const fields: Field[] = [{ name: 'oclSmiles', value: smiles }];

    fieldNames.forEach((name) => {
      const fieldValue = parser.getField(name);
      let value;
      if (isNumeric(fieldValue)) {
        value = parseFloat(fieldValue);
      } else {
        value = fieldValue;
      }
      fields.push({ name, value });
    });

    readMolecules.push({
      id: counter,
      molFile: currentMolFile,
      fields: fields,
    });
    counter++;
  }
  fieldNames.unshift('oclSmiles');

  return [readMolecules, fieldNames] as const;
};

settingsStore.subscribe(({ proteinPath, moleculesPath }) => {
  setIsMoleculesLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + moleculesPath, { mode: 'cors' })
    .then((resp) => {
      if (moleculesPath.endsWith('.sdf')) {
        resp
          .text()
          .then(parseSDF)
          .then(([readMolecules, fieldNames]) => {
            setMolecules(readMolecules);
            setFieldNames(fieldNames);
          });
      } else if (moleculesPath.endsWith('gzip') || moleculesPath.endsWith('gz')) {
        resp
          .arrayBuffer()
          .then((buffer) => ungzip(new Uint8Array(buffer)))
          .then((unzipped) => {
            let str = '';
            for (let i of unzipped) {
              str += String.fromCharCode(i);
            }
            return str;
          })
          .then(parseSDF)
          .then(([readMolecules, fieldNames]) => {
            setMolecules(readMolecules);
            setFieldNames(fieldNames);
          });
      }
    })
    .catch((reason) => {
      console.log('Request failed due to');
      console.log(reason);

      if (process.env.NODE_ENV === 'development') {
        // If CORS fails then use mock for now
        console.log('Using mock data instead');

        fetch('./moleculesmock.sdf')
          .then((resp) => resp.text())
          .then(parseSDF)
          .then(([readMolecules, fieldNames]) => {
            setMolecules(readMolecules);
            setFieldNames(fieldNames);
          });
      }
    })
    .finally(() => setIsMoleculesLoading(false));
});

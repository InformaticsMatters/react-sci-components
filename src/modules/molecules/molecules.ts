import { useRedux } from 'hooks-for-redux';
import { SDFileParser } from 'openchemlib/minimal';

import { settingsStore } from '../settings/settings';

export type Score = { name: string; value: number };

export interface Molecule {
  id: number;
  name: string;
  smiles: string;
  scores: Score[];
  molFile: string;
}

export interface MoleculesState {
  isMoleculesLoading: boolean;
  molecules: Molecule[];
  scoresNames: string[];
}

const initialState: MoleculesState = {
  isMoleculesLoading: false,
  molecules: [],
  scoresNames: [],
};

export const [
  useMolecules,
  { setIsMoleculesLoading, setMolecules, setScoresNames },
  moleculesStore,
] = useRedux('molecules', initialState, {
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({
    ...state,
    isMoleculesLoading,
  }),
  setMolecules: (state, molecules: Molecule[]) => ({ ...state, molecules }),
  setScoresNames: (state, scoresNames: string[]) => ({ ...state, scoresNames }),
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
    const molName = sdfMolecule.getName();
    const currentMolFile = sdfMolecule.toMolfile();
    const smiles = sdfMolecule.toIsomericSmiles();
    const fields: Score[] = [];

    fieldNames.forEach((fieldName) => {
      let fieldValue = parser.getField(fieldName);
      if (!isNaN(fieldValue as any)) {
        fields.push({ name: fieldName, value: parseFloat(fieldValue) });
      }
    });
    readMolecules.push({
      id: counter,
      name: molName,
      smiles,
      molFile: currentMolFile,
      scores: fields,
    });
    counter++;
  }

  return [readMolecules, fieldNames] as const;
};

settingsStore.subscribe(({ proteinPath, moleculesPath }) => {
  setIsMoleculesLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + moleculesPath, { mode: 'cors' })
    .then((resp) => {
      resp
        .text()
        .then(parseSDF)
        .then(([readMolecules, fieldNames]) => {
          setMolecules(readMolecules);
          setScoresNames(fieldNames);
        });
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
            setScoresNames(fieldNames);
          });
      }
    })
    .finally(() => setIsMoleculesLoading(false));
});

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
  molecules: Molecule[];
  scoresNames: string[];
}

const initialState: MoleculesState = {
  molecules: [],
  scoresNames: [],
};

export const [useMolecules, { setMolecules, setScoresNames }, moleculesStore] = useRedux(
  'molecules',
  initialState,
  {
    setMolecules: ({ scoresNames }, molecules: Molecule[]) => ({ scoresNames, molecules }),
    setScoresNames: ({ molecules }, scoresNames: string[]) => ({ molecules, scoresNames }),
  },
);

const parseSDF = (sdf: string) => {
  const readMolecules: Molecule[] = [];
  // Types for openchemlib are missing strict null checks so need 'null as any' here
  // TODO: can we specify the field we use with the second arg?
  const parser = new SDFileParser(sdf, null as any);
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

  setScoresNames(fieldNames);
  return readMolecules;
};

settingsStore.subscribe(({ proteinPath, moleculesPath }) => {
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + moleculesPath, { mode: 'cors' })
    .then((resp) => {
      resp
        .text()
        .then(parseSDF)
        .then((readMolecules) => {
          setMolecules(readMolecules);
        });
    })
    .catch((reason) => {
      // If CORS fails then use mock for now
      console.log(reason);

      fetch('./moleculesmock.sdf')
        .then((resp) => resp.text())
        .then(parseSDF)
        .then((readMolecules) => {
          setMolecules(readMolecules);
        });
    });
});

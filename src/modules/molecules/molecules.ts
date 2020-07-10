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
  moleculesLoadingProgress: string | null;
  molecules: Molecule[];
  scoresNames: string[];
}

const initialState: MoleculesState = {
  isMoleculesLoading: false,
  moleculesLoadingProgress: null,
  molecules: [],
  scoresNames: [],
};

export const [
  useMolecules,
  { setIsMoleculesLoading, setMoleculesLoadingProgress, setMolecules, setScoresNames },
  moleculesStore,
] = useRedux('molecules', initialState, {
  setIsMoleculesLoading: (state, isMoleculesLoading: boolean) => ({
    ...state,
    isMoleculesLoading,
  }),
  setMoleculesLoadingProgress: (state, moleculesLoadingProgress) => ({
    ...state,
    moleculesLoadingProgress,
  }),
  setMolecules: (state, molecules: Molecule[]) => ({ ...state, molecules }),
  setScoresNames: (state, scoresNames: string[]) => ({ ...state, scoresNames }),
});

function* parseSDF(sdf: string) {
  // Types for openchemlib are missing strict null checks so need 'null as any' here
  // TODO: can we specify the field we use with the second arg?
  const parser = new SDFileParser(sdf, null!);
  const fieldNames = parser.getFieldNames(1);
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

    yield {
      name: molName,
      smiles,
      molFile: currentMolFile,
      scores: fields,
    };
  }
}

const processMolecules = (sdf: string) => {
  const progress = parseSDF(sdf);

  const molecules: Molecule[] = [];
  let counter = 0;
  for (let molecule of progress) {
    molecules.push({ ...molecule, id: ++counter });
    if (counter % 50 === 0) {
      setMoleculesLoadingProgress(`Parsed ${counter} molecules`);
      console.log(counter);
    }
    setMoleculesLoadingProgress(`Parsed ${counter} molecules`);
  }
  setMolecules(molecules);
  setScoresNames(molecules[0].scores.map(({ name }) => name));
};

settingsStore.subscribe(({ proteinPath, moleculesPath }) => {
  setIsMoleculesLoading(true);
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + moleculesPath, { mode: 'cors' })
    .then((resp) => {
      resp.text().then(processMolecules);
    })
    .catch((reason) => {
      console.log('Request failed due to');
      console.log(reason);

      if (process.env.NODE_ENV === 'development') {
        // If CORS fails then use mock for now
        console.log('Using mock data instead');

        fetch('./moleculesmock.sdf')
          .then((resp) => resp.text())
          .then(processMolecules);
      }
    })
    .finally(() => setIsMoleculesLoading(false));
});

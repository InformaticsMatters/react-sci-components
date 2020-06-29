import { useRedux } from 'hooks-for-redux';
import { settingsStore } from '../settings/settings';
import { SDFileParser } from 'openchemlib/minimal';

export type Score = { name: string; value: number };

export type Molecule = { name: string; smiles: string; scores: Score[]; molFile: string };

const initialState: Molecule[] = [
    /*{ id: 1, name: "mol1", scores: [{ id: 1, name: "score1", value: 1 }, { id: 2, name: "score2", value: 2 }, { id: 3, name: "score3", value: 3 }] },
    { id: 2, name: "mol2", scores: [{ id: 1, name: "score1", value: 11 }, { id: 2, name: "score2", value: 21 }, { id: 3, name: "score3", value: 31 }] },
    { id: 3, name: "mol3", scores: [{ id: 1, name: "score1", value: 12 }, { id: 2, name: "score2", value: 22 }, { id: 3, name: "score3", value: 32 }] },
    { id: 4, name: "mol4", scores: [{ id: 1, name: "score1", value: 4 }, { id: 2, name: "score2", value: 5 }, { id: 3, name: "score3", value: 6 }] },
    { id: 5, name: "mol5", scores: [{ id: 1, name: "score1", value: 7 }, { id: 2, name: "score2", value: 8 }, { id: 3, name: "score3", value: 9 }] },
    { id: 6, name: "mol6", scores: [{ id: 1, name: "score1", value: 10 }, { id: 2, name: "score2", value: 13 }, { id: 3, name: "score3", value: 14 }] },
    { id: 7, name: "mol7", scores: [{ id: 1, name: "score1", value: 10 }, { id: 2, name: "score2", value: 20 }, { id: 3, name: "score3", value: 30 }] },
    { id: 8, name: "mol8", scores: [{ id: 1, name: "score1", value: 1 }, { id: 2, name: "score2", value: 5 }, { id: 3, name: "score3", value: 3 }] },
    { id: 9, name: "mol9", scores: [{ id: 1, name: "score1", value: 7 }, { id: 2, name: "score2", value: 29 }, { id: 3, name: "score3", value: 31 }] },
    { id: 10, name: "mol10", scores: [{ id: 1, name: "score1", value: 12 }, { id: 2, name: "score2", value: 26 }, { id: 3, name: "score3", value: 13 }] },
    { id: 11, name: "mol11", scores: [{ id: 1, name: "score1", value: 13 }, { id: 2, name: "score2", value: 22 }, { id: 3, name: "score3", value: 31 }] },
    { id: 12, name: "mol12", scores: [{ id: 1, name: "score1", value: 14 }, { id: 2, name: "score2", value: 20 }, { id: 3, name: "score3", value: 3 }] }*/
];

export const [useMolecules, { setMolecules }, moleculesStore] = useRedux(
    'molecules',
    initialState,
    {
        setMolecules: (molecules, newMolecules: Molecule[]) => newMolecules,
    },
);

const unsubscribe = settingsStore.subscribe(
    ({ proteinPath, moleculesPath, xprop, yprop, color, size }) => {
        const proxyurl = 'https://cors-anywhere.herokuapp.com/';
        fetch(proxyurl + moleculesPath, { mode: 'cors' }).then((resp) => {
            resp.text().then((sdf) => {
                const readMolecules: Molecule[] = [];
                // Types for openchemlib are missing strict null checks
                const parser = new SDFileParser(sdf, null as any);
                const fieldNames = parser.getFieldNames(1);
                while (parser.next()) {
                    const molecule = parser.getMolecule();
                    const molName = molecule.getName();
                    const currentMolFile = molecule.toMolfile();
                    const smiles = molecule.toIsomericSmiles();
                    const fields: Score[] = [];
                    fieldNames.forEach((fieldName) => {
                        let fieldValue = parser.getField(fieldName);
                        if (!isNaN(fieldValue as any)) {
                            fields.push({ name: fieldName, value: parseFloat(fieldValue) });
                        }
                    });
                    readMolecules.push({
                        name: molName,
                        smiles,
                        molFile: currentMolFile,
                        scores: fields,
                    });
                }

                setMolecules(readMolecules);
            });
        });
    },
);

import { Shape } from 'ngl';

import { MOL_REPRESENTATION } from './constants';
import {
  assignRepresentationArrayToComp,
  createRepresentationsArray,
  createRepresentationStructure,
} from './generatingObjects';
import { NGLMolecule } from './NGLView';

export const showProtein = (stage: any, protein: string, centerOn: boolean) => {
  if (protein && protein !== '') {
    const stringBlob = new Blob([protein], { type: 'text/plain' });
    stage.loadFile(stringBlob, { ext: 'pdb' }).then((comp: any) => {
      const reprArray = createRepresentationsArray([
        createRepresentationStructure(MOL_REPRESENTATION.cartoon, {
          colorScheme: 'uniform',
          opacity: 0.7,
        }),
        createRepresentationStructure(MOL_REPRESENTATION.licorice, {
          colorScheme: 'uniform',
          opacity: 0.3,
          radiusType: 'size',
          scale: 0.4,
        }),
      ]);
      if (centerOn) {
        comp.autoView();
      }

      return Promise.resolve(assignRepresentationArrayToComp(reprArray, comp));
    });
  }
};

const showLigand = (stage: any, molecule: NGLMolecule, centerOn: boolean) => {
  let stringBlob = new Blob([molecule.mol.molFile], { type: 'text/plain' });
  return stage.loadFile(stringBlob, { name: molecule.mol.id, ext: 'sdf' }).then((comp: any) => {
    const reprArray = createRepresentationsArray([
      createRepresentationStructure(MOL_REPRESENTATION.licorice, {
        colorScheme: 'element',
        colorValue: molecule.color,
        multipleBond: true,
        opacity: 1.0,
        undefined,
      }),
    ]);

    if (comp.name !== undefined && comp.name) {
      comp.name = comp.name + '_LIGAND';
    } else {
      comp.name = '_LIGAND';
    }

    if (centerOn) {
      comp.autoView('ligand');
    }
    return assignRepresentationArrayToComp(reprArray, comp);
  });
};

export const showLigands = (stage: any, molsInView: NGLMolecule[], centerOn: boolean) => {
  const currentOrientation = stage.viewerControls.getOrientation();
  molsInView.forEach((mol) => showLigand(stage, mol, centerOn));
  if (centerOn === false) {
    stage.viewerControls.orient(currentOrientation);
  }
};

/**
 * Add interactions between the protein and molecules
 */

type Coordinate = [number, number, number];

const INTERACTION_FIELDS = [
  'HydrogenBondInteraction',
  'HydrophobicInteraction',
  'SaltBridgeInteraction',
  'PiCationInteraction',
  'PiStackingInteraction',
  'HalogenBondInteraction',
];

const INTERACTION_COLOURS: { [key: string]: Coordinate } = {
  HydrogenBond: [0.7, 0.7, 0.0], // yellow
  PiStacking: [1.0, 0.6, 0.0], // orange
  PiCation: [0.6, 0.4, 0.2], // brown
  SaltBridge: [1.0, 0.0, 0.0], // red
  Hydrophobic: [0.0, 1.0, 1.0], // cyan
  HalogenBond: [0.0, 0.0, 1.0], // blue
};

type InteractionDatum = Readonly<[string, string, Coordinate, Coordinate]>;

const addInteractions = (stage: any, name: string, interData: InteractionDatum[]) => {
  const size = 0.5;
  const shape = new Shape(name, { disableImpostor: true, radialSegments: 10 });

  for (let [type, canon, pos1, pos2] of interData) {
    shape.addCylinder(pos1, pos2, INTERACTION_COLOURS[type], size, canon);
  }
  const shapeComp = stage.addComponentFromObject(shape);
  shapeComp.addRepresentation('buffer', { opacity: 0.5, wireframe: false });
};

const CANON_MATCHER = /\w+,/g; // To access the first "word" of the interaction string
// To access the coordinates ~ [1.2, -1.2, 0.56]
const COORDINATE_MATCHER = /\[(-?\d+.\d+), (-?\d+.\d+), (-?\d+.\d+)\]/g;

const parseInteractionValue = (value: string) => {
  return (
    value
      .split(/\n/)
      .map((v) => {
        // Get the coordinates parts of the value
        const canon = v.match(CANON_MATCHER);
        const coords = v.match(COORDINATE_MATCHER);

        return [coords, canon] as const;
      })
      .filter((result): result is [RegExpMatchArray, RegExpMatchArray] =>
        result.every((v) => v !== null),
      )
      // Parse strings to numeric triplets
      .map(
        ([coords, [canon]]) =>
          [canon, ...coords.map((c) => JSON.parse(c))] as [string, Coordinate, Coordinate],
      )
  );
};

const showInteraction = ({ mol }: NGLMolecule, stage: any) => {
  mol.fields
    .filter(({ name }) => INTERACTION_FIELDS.includes(name)) // Remove non-interaction fields
    .filter(({ value }) => value !== null) // Some values can be null so remove them
    // Can be confident that strings remain
    .map(({ value, ...rest }) => ({ value: value as string, ...rest }))
    .map(({ value, name }) => {
      const parsedValue = parseInteractionValue(value);
      // Arrange values in the format required by addInteractions
      return parsedValue.map(
        (v) => [name.substring(0, name.indexOf('Interaction')), ...v] as const,
      );
    })
    .forEach((interaction) => addInteractions(stage, String(mol.id), interaction));
};

export const showInteractions = (stage: any, molsInView: NGLMolecule[]) => {
  molsInView.forEach((mol) => showInteraction(mol, stage));
};

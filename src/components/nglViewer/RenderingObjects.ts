import {createRepresentationStructure, createRepresentationsArray, assignRepresentationArrayToComp} from './GeneratingObjects';
import {MOL_REPRESENTATION} from './Constants';
import {NGLMolecule} from './NGLView';

export const showProtein = (stage: any, protein: string) => {
    const stringBlob = new Blob([protein], {type: 'text/plain'});
    stage.loadFile(stringBlob, {ext: "pdb"}).then((comp: any) => {
        const reprArray = createRepresentationsArray([createRepresentationStructure('cartoon', {})]);
        comp.autoView();

        return Promise.resolve(assignRepresentationArrayToComp(reprArray, comp));
    });
};

const showLigand = ( stage: any, molecule: NGLMolecule ) => {
    let stringBlob = new Blob([molecule.mol.molFile], { type: 'text/plain' });
    return stage.loadFile(stringBlob, { name: molecule.mol.id, ext: 'sdf' }).then((comp: any) => {
      const reprArray =
        createRepresentationsArray([
          createRepresentationStructure(
            MOL_REPRESENTATION.ballPlusStick,
            {
              colorScheme: 'element',
              colorValue: molecule.color,
              multipleBond: true,
              undefined
            }
          )
        ]);
  
      comp.autoView('ligand');
      return assignRepresentationArrayToComp(reprArray, comp);
    });
};

export const showLigands = (stage: any, molsInView: NGLMolecule[]) => {
    molsInView.forEach(mol => showLigand(stage, mol));
};

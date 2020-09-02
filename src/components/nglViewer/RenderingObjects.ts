import {createRepresentationStructure, createRepresentationsArray, assignRepresentationArrayToComp} from './GeneratingObjects';
import {MOL_REPRESENTATION} from './Constants';
import {NGLMolecule} from './NGLView';

export const showProtein = (stage: any, protein: string, centerOn: boolean) => {
    if (protein && protein !== '') {
      const stringBlob = new Blob([protein], {type: 'text/plain'});
      stage.loadFile(stringBlob, {ext: "pdb"}).then((comp: any) => {
          const reprArray = createRepresentationsArray(
          [
            createRepresentationStructure(MOL_REPRESENTATION.cartoon, {
              colorScheme: 'uniform',
              opacity: 0.7}),
              createRepresentationStructure(MOL_REPRESENTATION.licorice, {
              colorScheme: 'uniform',
              opacity: 0.3,
              radiusType: 'size',
              scale: 0.4})
          ]);
          if (centerOn) {
            comp.autoView();
          };
  
          return Promise.resolve(assignRepresentationArrayToComp(reprArray, comp));
      });
    };
};

const showLigand = ( stage: any, molecule: NGLMolecule, centerOn: boolean) => {
    let stringBlob = new Blob([molecule.mol.molFile], { type: 'text/plain' });
    return stage.loadFile(stringBlob, { name: molecule.mol.id, ext: 'sdf' }).then((comp: any) => {
      const reprArray =
        createRepresentationsArray([
          createRepresentationStructure(
            MOL_REPRESENTATION.licorice,
            {
              colorScheme: 'element',
              colorValue: molecule.color,
              multipleBond: true,
              opacity: 1.0,
              undefined
            }
          )
        ]);
      
      if (comp.name !== undefined && comp.name) {
        comp.name = comp.name + '_LIGAND';
      } else {
        comp.name = '_LIGAND';
      }

      if (centerOn) {
        comp.autoView('ligand');
      };
      return assignRepresentationArrayToComp(reprArray, comp);
    });
};

export const showLigands = (stage: any, molsInView: NGLMolecule[], centerOn: boolean) => {
    const currentOrientation = stage.viewerControls.getOrientation();
    molsInView.forEach(mol => showLigand(stage, mol, centerOn));
    if (centerOn === false) {
      stage.viewerControls.orient(currentOrientation);
    };
};

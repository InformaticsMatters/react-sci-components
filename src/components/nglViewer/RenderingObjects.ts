import {createRepresentationStructure, createRepresentationsArray, assignRepresentationArrayToComp} from './GeneratingObjects';

export const showProtein = (stage: any, protein: string) => {
    const stringBlob = new Blob([protein], {type: 'text/plain'});
    stage.loadFile(stringBlob, {ext: "pdb"}).then((comp: any) => {
        const reprArray = createRepresentationsArray([createRepresentationStructure('cartoon', {})]);
        comp.autoView();

        return Promise.resolve(assignRepresentationArrayToComp(reprArray, comp));
    });
}
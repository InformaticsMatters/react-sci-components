export const createRepresentationStructure = (type: string, params: {}, lastKnownID = undefined) => ({ type, params, lastKnownID });

export const createRepresentationsArray = (representations: any) =>
  representations && representations.map((r: any) => createRepresentationStructure(r.type, r.params, r.lastKnownID));

export const assignRepresentationArrayToComp = (representations: [], comp: any) =>
  representations.map((rep: any) => assignRepresentationToComp(rep.type, rep.params, comp, rep.lastKnownID));

export const assignRepresentationToComp = (type: string, params: {}, comp: any, lastKnownID = undefined) => {
  const createdRepresentation = comp.addRepresentation(type, params || {});
  return {
    lastKnownID: lastKnownID || createdRepresentation.uuid,
    uuid: createdRepresentation.uuid,
    type,
    params: createdRepresentation.getParameters(),
    templateParams: createdRepresentation.repr.parameters
  };
};  
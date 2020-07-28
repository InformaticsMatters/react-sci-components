import React, { memo, useCallback, useEffect } from 'react';

import { throttle } from 'lodash';
import { Molecule, useMolecules } from 'modules/molecules/molecules';
import { Stage } from 'ngl';

import { useTheme } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Colour, useCardActions } from '../cardView/cardActions';
import { NGL_PARAMS, VIEWS } from './Constants';
import { removeNglComponents, setOrientation } from './DispatchActions';
import {
  initialState as NGL_INITIAL,
  setNglViewList,
  setStage,
  useNGLLocalState,
} from './NGLLocalState';
import { showLigands, showProtein } from './RenderingObjects';

export interface NGLMolecule {
  id: number;
  mol: Molecule;
  color: string;
}

const getMoleculeObjects = (molIds: number[], colors: Colour[], molecules: Molecule[]) => {
  let i;
  const selectedMols: NGLMolecule[] = [];
  for (i = 0; i < molIds.length; i++) {
    const currentId = molIds[i];
    const currentColor = colors.filter((col) => col.id === currentId);
    const currentMol = molecules.filter((mol) => mol.id === currentId);
    if (currentMol) {
      const nglMol: NGLMolecule = {
        id: currentId,
        color: currentColor && currentColor.length === 1 ? currentColor[0].colour : '#FFFF00',
        mol: currentMol[0],
      };
      selectedMols.push(nglMol);
    }
  }

  return selectedMols;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1) / 2,
      //@ts-ignore
      boxShadow: [
        '0px 2px 1px -1px rgba(0,0,0,0.2)',
        '0px 1px 1px 0px rgba(0,0,0,0.14)',
        '0px 1px 3px 0px rgba(0,0,0,0.12)',
      ],
      marginBottom: theme.spacing(1),
    },
  }),
);

export const NglView: React.FC<{ div_id: string; height: string }> = memo(({ div_id, height }) => {
  // connect to NGL Stage object

  const { viewList, stage, protein, nglOrientations, molsInView } = useNGLLocalState();
  const { molecules } = useMolecules();
  const { colours } = useCardActions();
  const classes = useStyles();
  const theme = useTheme();

  stage?.handleResize();

  const registerNglView = useCallback(
    (id: string, stage: any) => {
      if (viewList.filter((ngl) => ngl.id === id).length > 0) {
        console.log(new Error(`Cannot register NGL View with used ID! ${id}`));
      } else {
        let extendedList = viewList;
        extendedList.push({ id, stage });
        setNglViewList(extendedList);
      }
    },
    [viewList],
  );

  const unregisterNglView = useCallback(
    (id: string) => {
      if (viewList.filter((ngl) => ngl.id === id).length === 0) {
        console.log(new Error(`Cannot remove NGL View with given ID! ${id}`));
      } else {
        for (let i = 0; i < viewList.length; i++) {
          if (viewList[i].id === id) {
            viewList.splice(i, 1);
            setNglViewList(viewList);
            break;
          }
        }
      }
    },
    [viewList],
  );

  const getNglView = useCallback(
    (id: string) => {
      const filteredList =
        viewList && viewList.length > 0 ? viewList.filter((ngl) => ngl.id === id) : [];
      switch (filteredList.length) {
        case 0:
          return undefined;
        case 1:
          return filteredList[0];
        default:
          console.log(new Error('Cannot found NGL View with given ID!'));
          break;
      }
    },
    [viewList],
  );

  const handleOrientationChanged = useCallback(
    throttle(() => {
      const newStage = getNglView(div_id);
      if (newStage) {
        const currentOrientation = newStage.stage.viewerControls.getOrientation();
        setOrientation(div_id, currentOrientation, nglOrientations);
      }
    }, 250),
    [div_id, getNglView, setOrientation],
  );

  // Initialization of NGL View component
  const handleResize = useCallback(() => {
    const newStage = getNglView(div_id);
    if (newStage) {
      newStage.stage.handleResize();
    }
  }, [div_id, getNglView]);

  const registerStageEvents = useCallback(
    (newStage, getNglView) => {
      if (newStage) {
        window.addEventListener('resize', handleResize);
        // newStage.mouseControls.add('clickPick-left', (st, pickingProxy) =>
        //   handleNglViewPick(st, pickingProxy, getNglView)
        // );

        newStage.mouseObserver.signals.scrolled.add(handleOrientationChanged);
        newStage.mouseObserver.signals.dropped.add(handleOrientationChanged);
        newStage.mouseObserver.signals.dragged.add(handleOrientationChanged);
      }
    },
    [handleResize, handleOrientationChanged /*, handleNglViewPick*/],
  );

  const unregisterStageEvents = useCallback(
    (newStage, getNglView) => {
      if (newStage) {
        window.addEventListener('resize', handleResize);
        window.removeEventListener('resize', handleResize);
        // newStage.mouseControls.remove('clickPick-left', (st, pickingProxy) =>
        //   handleNglViewPick(st, pickingProxy, getNglView)
        // );
        newStage.mouseObserver.signals.scrolled.remove(handleOrientationChanged);
        newStage.mouseObserver.signals.dropped.remove(handleOrientationChanged);
        newStage.mouseObserver.signals.dragged.remove(handleOrientationChanged);
      }
    },
    [handleResize, handleOrientationChanged /*, handleNglViewPick*/],
  );

  useEffect(() => {
    const nglViewFromContext = getNglView(div_id);
    if (stage === undefined && !nglViewFromContext) {
      const newStage = new Stage(div_id);
      // set default settings
      if (div_id === VIEWS.MAJOR_VIEW) {
        // set all defaults for main view
        for (const [key, value] of Object.entries(NGL_INITIAL.viewParams)) {
          newStage.setParameters({ [key]: value });
        }
      } else {
        // set only background color for preview view
        newStage.setParameters({
          [NGL_PARAMS.backgroundColor]: NGL_INITIAL.viewParams[NGL_PARAMS.backgroundColor],
        });
      }
      registerNglView(div_id, newStage);
      registerStageEvents(newStage, getNglView);
      setStage(newStage);
      removeNglComponents(newStage);
      showProtein(newStage, protein);
      const molsToDisplay = getMoleculeObjects(molsInView, colours, molecules);
      showLigands(newStage, molsToDisplay);
    } else if (stage === undefined && nglViewFromContext && nglViewFromContext.stage) {
      registerStageEvents(nglViewFromContext.stage, getNglView);
      setStage(nglViewFromContext.stage);
      removeNglComponents(nglViewFromContext.stage);
      showProtein(nglViewFromContext.stage, protein);
      const molsToDisplay = getMoleculeObjects(molsInView, colours, molecules);
      showLigands(nglViewFromContext.stage, molsToDisplay);
    } else if (stage) {
      removeNglComponents(stage);
      showProtein(stage, protein);
      const molsToDisplay = getMoleculeObjects(molsInView, colours, molecules);
      showLigands(stage, molsToDisplay);
      registerStageEvents(stage, getNglView);
    }

    return () => {
      if (stage) {
        unregisterStageEvents(stage, getNglView);
        unregisterNglView(div_id);
      }
    };
  }, [
    div_id,
    handleResize,
    registerNglView,
    unregisterNglView,
    handleOrientationChanged,
    registerStageEvents,
    unregisterStageEvents,
    stage,
    getNglView,
    protein,
    colours,
    molecules,
    molsInView,
  ]);
  // End of Initialization NGL View component

  return (
    <div
      id={div_id}
      className={/*div_id === VIEWS.MAJOR_VIEW ? classes.paper : */ undefined}
      style={{
        height: `100vh`,
      }}
    />
  );
});

NglView.displayName = 'NglView';

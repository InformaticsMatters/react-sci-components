import { plotSelectionStore } from 'components/scatterplot/plotSelection';
import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';
import { resolveState } from '../../modules/state/stateResolver';

import {initializeModule, isBeingStateReloadedFromFile} from '../../modules/state/stateConfig';

/**
 * Redux store to manage the card state.
 *
 * Each card can be:
 * * made sticky
 * * coloured for use in the NGL viewer
 * * can be toggled for view in the NGL viewer
 */
// Types

export type Colour = { id: number; colour: string };

export interface CardActionsState {
  isInNGLViewerIds: number[];
  colours: Colour[];
}

type SetColourPayload = { id: number; colour: string };

const initialState: CardActionsState = {
  isInNGLViewerIds: [],
  colours: [],
};

// Utils

const toggleIdInArray = (array: number[], id: number) => {
  if (array.includes(id)) {
    return (array = array.filter((id_) => id_ !== id));
  } else {
    return (array = [...array, id]);
  }
};

export const getColour = (id: number, colours: Colour[]) => {
  return colours.find((colour) => colour.id === id)?.colour;
};

export const [
  useCardActions,
  { resetCardActions, resetIdsInNGLViewer, clearColour, setColour, toggleIsInNGLViewer },
  cardActionsStore,
] = useRedux('cardActions', resolveState('cardActions', initialState), {
  resetCardActions: () => initialState,
  resetIdsInNGLViewer: ({ isInNGLViewerIds, colours }) => {
    const ids = colours.map((c) => c.id);
    return {
      colours: colours,
      isInNGLViewerIds: isInNGLViewerIds.filter((id) => ids.includes(id)),
    };
  },
  clearColour: ({ colours, ...rest }, id: number) => ({
    ...rest,
    colours: colours.filter((c) => c.id !== id),
  }),
  setColour: ({ colours, ...rest }, { id, colour }: SetColourPayload) => {
    const c = colours.find((colourObj) => colourObj.id === id);
    if (c === undefined) {
      return { ...rest, colours: [...colours, { id, colour }] };
    } else {
      return {
        ...rest,
        colours: [...colours.filter(({ id: id_ }) => id_ !== id), { id, colour }],
      };
    }
  },
  toggleIsInNGLViewer: ({ isInNGLViewerIds, ...rest }, id: number) => {
    return { ...rest, isInNGLViewerIds: toggleIdInArray(isInNGLViewerIds, id) };
  },
});

moleculesStore.subscribe(() => {
  if (!isBeingStateReloadedFromFile()) {
    resetCardActions();
  };
});
plotSelectionStore.subscribe(() => {
  if (!isBeingStateReloadedFromFile()) {
    resetIdsInNGLViewer()
  };
});

initializeModule('cardActions');
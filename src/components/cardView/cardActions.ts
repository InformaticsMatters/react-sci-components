import { useRedux } from 'hooks-for-redux';

import { moleculesStore } from '../../modules/molecules/molecules';

/*
 * Redux store to manage the card state.
 *
 * Each card can be:
 * - made sticky
 * - coloured for use in the NGL viewer
 * - can be toggled for view in the NGL viewer
 */
// Types

export type Colour = { id: number; colour: string };

export interface CardActionsState {
  isPinnedIds: number[];
  isInNGLViewerIds: number[];
  colours: Colour[];
}

type SetColourPayload = { id: number; colour: string };

const initialState: CardActionsState = {
  isPinnedIds: [],
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
  { resetCardActions, toggleIsPinned, setColour, toggleIsInNGLViewer },
  cardActionsStore,
] = useRedux('cardActions', initialState, {
  resetCardActions: () => initialState,
  toggleIsPinned: ({ isPinnedIds, ...rest }, id: number) => {
    return { ...rest, isPinnedIds: toggleIdInArray(isPinnedIds, id) };
  },
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

moleculesStore.subscribe(() => resetCardActions());

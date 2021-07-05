import { useRedux } from 'hooks-for-redux';

import { resolveState } from '../../modules/state/stateResolver';

/**
 * Redux store to manage the card state.
 *
 * Each card can be:
 * * given a colour
 * * can be selected
 */

// Types

export type Colour = { id: number; colour: string };

export interface CardActionsState {
  selectedIds: number[];
  colours: Colour[];
}

type SetColourPayload = { id: number; colour: string };

const initialState: CardActionsState = {
  selectedIds: [],
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
  {
    resetCardActions,
    setColours,
    clearColours,
    disableCards,
    toggleSelected,
    deselectAllWithoutColour,
    retainColours,
  },
  cardActionsStore,
] = useRedux('cardActions', resolveState('cardActions', initialState), {
  /**
   * Sets card actions state slice back to the initial value
   *
   * State becomes `{ selectedIds: [], colours: [] }`
   */
  resetCardActions: () => initialState,

  /**
   * Merge the passed id-colour pair(s) into the `colours` state.
   * New ids are appended, old ids are shifted to the end of the array
   *
   * @param prevState previous value of state
   * @param payload id-colour pair (or array of) to be injected into the state
   */
  setColours: ({ colours, ...rest }, payload: SetColourPayload | SetColourPayload[]) => {
    // Convert union payload into array parse-able by one algorithm
    const p = [payload].flat();

    p.forEach(({ id, colour }) => {
      // Remove colour when it's already but add it back to the end
      // When the id is "new" is it just appended as the filter has no effect
      colours = [...colours.filter(({ id: id_ }) => id_ !== id), { id, colour }];
    });

    return { colours, ...rest };
  },
  /**
   * Remove passed id(s) from the `selectedIds` section of state
   * When the payload is `undefined` all colours are removed
   *
   * @param prevState previous value of state
   * @param payload colours of this id (or array of) to be removed from state
   */
  clearColours: ({ colours, ...rest }, payload?: number | number[]) => {
    if (payload !== undefined) {
      // Convert union payload into array parse-able by one algorithm
      const ids = [payload].flat();

      return {
        ...rest,
        colours: colours.filter(({ id }) => !ids.includes(id)),
      };
    } else {
      return { ...rest, colours: [] };
    }
  },

  // TODO: implement this reducer
  // enableCards: (state, payload: number | number[]) => {},

  /**
   * Unselect cards with the given id(s)
   * If the payload is undefined, all cards are unselected
   *
   * @param state previous value of state
   * @param payload id (or array of) removed from the selected cards array
   */
  disableCards: ({ selectedIds, ...rest }, payload?: number | number[]) => {
    if (payload !== undefined) {
      const ids = [payload].flat();
      return {
        selectedIds: selectedIds.filter((id) => !ids.includes(id)),
        ...rest,
      };
    } else {
      return { selectedIds: [], ...rest };
    }
  },

  /**
   * Toggles the selected state of a given `id`
   *
   * @param prevState previous value of state
   * @param id id of card to toggle its selection
   */
  toggleSelected: ({ selectedIds, ...rest }, id: number) => {
    // TODO: need to make this work for array of ids too
    return { ...rest, selectedIds: toggleIdInArray(selectedIds, id) };
  },

  /**
   * Remove ids from `selectedIds` if the id isn't paired with a colour
   *
   * @param prevState previous value of state
   */
  deselectAllWithoutColour: ({ selectedIds, colours }) => {
    // Preserve "pinned" (coloured) cards between selections
    const ids = colours.map((c) => c.id);
    return {
      colours,
      selectedIds: selectedIds.filter((id) => ids.includes(id)),
    };
  },

  /**
   * Remove all colours except for the id(s) provided
   *
   * @param state previous value of state
   * @param payload id (or array of) of card(s) that should be kept if a colour is set
   */
  retainColours: ({ colours, ...rest }, payload: number | number[]) => {
    const ids = [payload].flat();

    return { ...rest, colours: colours.filter(({ id }) => ids.includes(id)) };
  },
});

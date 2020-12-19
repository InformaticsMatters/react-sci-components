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
  { resetCardActions, setColours, clearColours, toggleSelected, deselectAllWithoutColour },
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
      const c = colours.find((colourObj) => colourObj.id === id);

      // TODO: I think this can be cleaned up and just use the contents of the else condition
      // as in both cases the new value is added to the end of the array
      if (c === undefined) {
        // Add new colour
        colours = [...colours, { id, colour }];
      } else {
        // Remove colour when it's already but add it back to the end
        colours = [...colours.filter(({ id: id_ }) => id_ !== id), { id, colour }];
      }
    });

    return { colours, ...rest };
  },
  /**
   * Remove passed id(s) from the `selectedIds` section of state
   *
   * @param prevState previous value of state
   * @param payload id (or array of) to be injected to the `selectedIds` in the state
   */
  clearColours: ({ colours, ...rest }, payload: number | number[]) => {
    // Convert union payload into array parse-able by one algorithm
    const ids = [payload].flat();

    return {
      ...rest,
      colours: colours.filter(({ id }) => ids.includes(id)),
    };
  },

  // TODO: implement these reducers
  // enableCard: (state, payload: number | number[]) => {},
  // disableCard: (state, payload: number | number[]) => {},

  /**
   * Toggles the selected state of a given `id`
   *
   * @param prevState previous value of state
   * @param id id of card to toggle its selection
   */
  toggleSelected: ({ selectedIds, ...rest }, id: number) => {
    return { ...rest, selectedIds: toggleIdInArray(selectedIds, id) };
  },

  /**
   * Remove ids from `selectedIds` if the id isn't paired with a colour
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
});

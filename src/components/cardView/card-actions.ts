/*
 * Redux store to manage the card state.
 *
 * Each card can be:
 * - made sticky
 * - coloured for use in the NGL viewer
 * - can be toggled for view in the NGL viewer
 */

import { useRedux } from 'hooks-for-redux';
import { moleculesStore } from '../../modules/molecules/molecules';

// Types

export interface Card {
  name: string; // "primary key"
  isPinned: boolean;
  colour: string; // HEX colour value
  isInNGL: boolean;
}

export type CardActionsState = Card[];

const initialState: CardActionsState = [];

// Utils

// Create copy of cards array with the correct card updates with the passed value
// Use generic to allow value to take the required type
const updateCard = <TValue>(cards: Card[], name: string, field: keyof Card, value: TValue) =>
  cards.map((card) => {
    if (card.name === name) {
      return { ...card, [field]: value };
    }
    return card;
  });

export const [
  useCardActions,
  { setCards, setIsPinned, setColour, setIsInNGL },
  cardActionsStore,
] = useRedux('cardActions', initialState, {
  setCards: (_, newCards) => newCards,
  setIsPinned: (cards, { name, isPinned }) => updateCard(cards, name, 'isPinned', isPinned),
  setColour: (cards, { name, colour }) => updateCard(cards, name, 'colour', colour),
  setIsInNGL: (cards, { name, isInNGL }) => updateCard(cards, name, 'isInNGL', isInNGL),
});

moleculesStore.subscribe((molecules) => {
  setCards([]);
});

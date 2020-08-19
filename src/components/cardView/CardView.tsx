import React, { useState } from 'react';

import { CSSGrid, enterExitStyle } from 'react-stonecutter';
import styled from 'styled-components';

import { Button, Grow } from '@material-ui/core';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { usePlotSelection } from '../scatterplot/plotSelection';
import CalculationsTable from './CalculationsTable';
import {
  CardActionsState,
  clearColour,
  setColour,
  toggleIsInNGLViewer,
  useCardActions,
} from './cardActions';
import { useCardViewConfiguration } from './cardViewConfiguration';
import ColourPicker from './ColourPicker';
import MolCard from './MolCard';

const { enter, entered, exit } = enterExitStyle.fromLeftToRight;
const CARDS_PER_PAGE = 25;
const GRID_PADDING = 2; // theme spacing units
const MIN_CARD_WIDTH = 144; //px === 9rem
const GUTTER_SIZE = 16; // px === 1rem

const moleculeSorter = ({ colours }: CardActionsState) => (ma: Molecule, mb: Molecule) => {
  const ca = colours.find((c) => c.id === ma.id);
  const cb = colours.find((c) => c.id === mb.id);

  if (ca && !cb) {
    return -1;
  } else if (ca && cb) {
    return 0;
  } else if (!ca && cb) {
    return 1;
  }
  return 0;
};

const palette = {
  red: '#ff0000',
  blue: '#0000ff',
  yellow: 'yellow',
  cyan: 'cyan',
  lime: 'lime',
  orange: 'orange',
};

// Need to pass styles for action render prop
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Positioning of buttons in card
    actionsRoot: {
      position: 'absolute',
      top: -theme.spacing(1),
      left: 0,
      right: 0,
      justifyContent: 'center',
    },
  }),
);
interface IProps {
  width: number;
}

const CardView = ({ width }: IProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [loadMoreCount, setLoadMoreCount] = useState(1);

  const { molecules, fieldNames, fieldNickNames } = useMolecules();
  const selectedMoleculesIds = usePlotSelection();
  const actions = useCardActions();
  const { isInNGLViewerIds, colours } = actions;
  const { fields, enabledFields, fieldForDepiction } = useCardViewConfiguration();

  const displayMolecules = molecules.filter(({ id }) => {
    const isSelected = selectedMoleculesIds.includes(id);
    const isColoured = colours.filter(({ id: cid }) => cid === id)[0];
    return isSelected || isColoured;
  });

  // Calculate dimensions of card for stonecutter grid
  const gridWidth = width - 2 * theme.spacing(GRID_PADDING); // padding removed
  const numColumns = Math.floor(gridWidth / MIN_CARD_WIDTH);

  let cardWidth;
  if (numColumns > 1) {
    cardWidth = (gridWidth - (numColumns - 1) * GUTTER_SIZE) / numColumns;
  } else {
    cardWidth = gridWidth;
  }

  const imageSize = cardWidth - 2 * theme.spacing(2);
  const cardHeight =
    imageSize + enabledFields.length * 22.9 + 2 * theme.spacing(2) + theme.spacing(1);

  return (
    <GridWrapper>
      <Grid
        duration={200}
        columns={numColumns}
        itemHeight={cardHeight}
        columnWidth={cardWidth}
        gutterWidth={GUTTER_SIZE}
        gutterHeight={GUTTER_SIZE}
        enter={enter}
        entered={entered}
        exit={exit}
      >
        {displayMolecules
          .sort(moleculeSorter(actions))
          .splice(0, CARDS_PER_PAGE * loadMoreCount)
          .map(({ id, fields: fieldValues }) => {
            let smiles = fieldValues.find((field) => field.name === fieldForDepiction)?.value;
            if (typeof smiles !== 'string') {
              smiles = '';
            }
            fieldValues.sort(
              (a, b) =>
                fields.findIndex((f) => f.name === a.name) -
                fields.findIndex((f) => f.name === b.name),
            );
            const selected = isInNGLViewerIds.includes(id);
            return (
              <span key={id}>
                <MolCard
                  smiles={smiles}
                  elevation={selected ? 10 : undefined}
                  bgColor={selected ? theme.palette.grey[100] : undefined}
                  depictWidth={imageSize}
                  depictHeight={imageSize}
                  onClick={() => toggleIsInNGLViewer(id)}
                  actionsProps={{ className: classes.actionsRoot }}
                  actions={(hover) => {
                    const colour = colours.find((c) => c.id === id);
                    return (
                      <Grow in={hover || colour !== undefined}>
                        <span>
                          <ColourPicker
                            iconColour={colour?.colour}
                            enabled={!!hover}
                            colours={palette}
                            setColour={(colour) => setColour({ id, colour })}
                            clearColour={() => clearColour(id)}
                          />
                        </span>
                      </Grow>
                    );
                  }}
                >
                  <CalculationsTable
                    properties={fieldValues
                      .filter(({ name }) => enabledFields.includes(name))
                      .map(({ name, ...rest }) => ({
                        ...rest,
                        name: fieldNickNames[fieldNames.indexOf(name)],
                      }))}
                    fontSize={'0.6rem'}
                  />
                </MolCard>
              </span>
            );
          })}
      </Grid>
      {!!(CARDS_PER_PAGE * loadMoreCount < selectedMoleculesIds.length) && (
        <Button variant="text" color="default" onClick={() => setLoadMoreCount(loadMoreCount + 1)}>
          Load More
        </Button>
      )}
    </GridWrapper>
  );
};

const Grid = styled(CSSGrid)`
  margin-bottom: 1rem;
`;

// Scrolling and height of grid region
const GridWrapper = styled.div`
  /* Height of elements above the grid */
  height: calc(100vh - ${({ theme }) => 2 * theme.spacing(2)}px);
  padding: ${({ theme }) => theme.spacing(2)}px;
  overflow-y: scroll;
  text-align: center;
`;

export default CardView;

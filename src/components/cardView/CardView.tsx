import React, { useState } from 'react';

import styled from 'styled-components';

import { Button } from '@material-ui/core';
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
import CardViewConfig from './CardViewConfig';
import { useCardViewConfiguration } from './cardViewConfiguration';
import ColourPicker from './ColourPicker';
import MolCard from './MolCard';

const CARDS_PER_PAGE = 50;

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
interface IProps {}

const CardView = () => {
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

  return (
    <>
      {!!displayMolecules.length && (
        <CardViewConfig
          fields={fields}
          enabledFields={enabledFields}
          depictionField={fieldForDepiction}
        />
      )}
      <GridWrapper>
        <Grid gap={theme.spacing(2)}>
          {displayMolecules
            .sort(moleculeSorter(actions))
            .splice(0, CARDS_PER_PAGE * loadMoreCount)
            .map(({ id, fields: fieldValues }, index) => {
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
                <span key={index}>
                  <MolCard
                    elevation={selected ? 10 : undefined}
                    bgColor={selected ? theme.palette.grey[100] : undefined}
                    smiles={smiles}
                    onClick={() => toggleIsInNGLViewer(id)}
                    actionsProps={{ className: classes.actionsRoot }}
                    actions={(hover) => {
                      const colour = colours.find((c) => c.id === id);
                      return (
                        <ColourPicker
                          iconColour={colour?.colour}
                          enabled={!!hover}
                          colours={palette}
                          setColour={(colour) => setColour({ id, colour })}
                          clearColour={() => clearColour(id)}
                        />
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
          <LoadMoreButton
            variant="text"
            color="default"
            onClick={() => setLoadMoreCount(loadMoreCount + 1)}
          >
            Load More
          </LoadMoreButton>
        )}
      </GridWrapper>
    </>
  );
};

const LoadMoreButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-auto-rows: max-content;
  grid-gap: ${({ gap }: { gap: number }) => gap}px;
`;

// Scrolling and height of grid region
const GridWrapper = styled.div`
  /* Height of elements above the grid */
  height: calc(100vh - ${({ theme }) => 48 + 2 * theme.spacing(2)}px);
  padding: ${({ theme }) => theme.spacing(2)}px;
  overflow-y: scroll;
  text-align: center;
`;

export default CardView;

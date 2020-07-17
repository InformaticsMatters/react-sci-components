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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - ${48 + 2 * theme.spacing(2)}px)`, // Height of elements above the grid
      padding: theme.spacing(2),
      overflowY: 'scroll',
      textAlign: 'center',
    },
    actionsRoot: {
      position: 'absolute',
      top: -theme.spacing(1),
      left: 0,
      right: 0,
      justifyContent: 'center',
    },
    button: {
      marginTop: theme.spacing(2),
      marginButton: theme.spacing(2),
    },
  }),
);
interface IProps {}

const CardView = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [loadMoreCount, setLoadMoreCount] = useState(1);

  const { molecules } = useMolecules();
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
      <div className={classes.root}>
        <Grid gap={theme.spacing(2)}>
          {displayMolecules
            .sort(moleculeSorter(actions))
            .splice(0, CARDS_PER_PAGE * loadMoreCount)
            .map(({ id, fields: fieldValues }, index) => {
              let smiles = fieldValues.find((field) => field.name === fieldForDepiction)?.value;
              if (typeof smiles !== 'string') {
                smiles = '';
              }
              fieldValues.sort((a, b) => fields.indexOf(a.name) - fields.indexOf(b.name));
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
                      properties={fieldValues.filter(({ name }) => enabledFields.includes(name))}
                      fontSize={'0.6rem'}
                    />
                  </MolCard>
                </span>
              );
            })}
        </Grid>
        {!!(CARDS_PER_PAGE * loadMoreCount < selectedMoleculesIds.length) && (
          <Button
            className={classes.button}
            variant="text"
            color="default"
            onClick={() => setLoadMoreCount(loadMoreCount + 1)}
          >
            Load More
          </Button>
        )}
      </div>
    </>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  grid-auto-rows: max-content;
  grid-gap: ${({ gap }: { gap: number }) => gap}px;
`;

export default CardView;

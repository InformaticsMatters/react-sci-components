import { Grow } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

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
import ColourPicker from './ColourPicker';
import MolCard from './MolCard';
import CardViewConfig from './CardViewConfig';
import { useCardViewConfiguration } from './cardViewConfiguration';

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
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
      gridAutoRows: 'max-content',
      gridGap: '1rem',
      overflowY: 'scroll',
      height: '85vh',
    },
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
      {displayMolecules.length && (
        <>
          <h3>Click to enable a card in the NGL viewer.</h3>
          <CardViewConfig
            fields={fields}
            enabledFields={enabledFields}
            depictionField={fieldForDepiction}
          />
        </>
      )}
      <div className={classes.root}>
        {displayMolecules
          .sort(moleculeSorter(actions))
          .map(({ id, fields: fieldValues }, index) => {
            fieldValues.sort((a, b) => fields.indexOf(a.name) - fields.indexOf(b.name));
            return (
              <span key={index}>
                <MolCard
                  elevation={isInNGLViewerIds.includes(id) ? 10 : undefined}
                  smiles={
                    (fieldValues.find((field) => field.name === fieldForDepiction)
                      ?.value as string) ?? ''
                  }
                  onClick={() => toggleIsInNGLViewer(id)}
                  actionsProps={{ className: classes.actionsRoot }}
                  actions={(hover) => {
                    const colour = colours.find((c) => c.id === id);
                    if (!!colour) {
                      return (
                        <ColourPicker
                          colours={{ 'Current Colour': colour.colour }}
                          setColour={(colour) => setColour({ id, colour })}
                          clearColour={() => clearColour(id)}
                        />
                      );
                    } else {
                      return (
                        <Grow in={hover}>
                          <div>
                            <ColourPicker
                              colours={palette}
                              setColour={(colour) => setColour({ id, colour })}
                            />
                          </div>
                        </Grow>
                      );
                    }
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
      </div>
    </>
  );
};

export default CardView;

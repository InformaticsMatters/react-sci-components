import { Grow, IconButton, Popper, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PaletteIcon from '@material-ui/icons/Palette';
import { ColorPalette } from 'material-ui-color';
import React, { useState } from 'react';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { usePlotSelection } from '../scatterplot/plotSelection';
import CalculationsTable from './CalculationsTable';
import {
  CardActionsState,
  getColour,
  setColour,
  toggleIsInNGLViewer,
  useCardActions,
} from './cardActions';
import MolCard from './MolCard';

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
      overflow: 'auto',
      padding: '1rem',
      height: '95vh',
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

  const molecules = useMolecules();
  const selectedMoleculesIds = usePlotSelection();
  const actions = useCardActions();
  const { isInNGLViewerIds, colours } = actions;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  const displayMolecules = molecules.filter(({ id }) => {
    const isSelected = selectedMoleculesIds.includes(id);
    const isColoured = colours.filter(({ id: cid }) => cid === id)[0];
    return isSelected || isColoured;
  });

  return (
    <>
      {displayMolecules.length && <h3>Click to enable a card in the NGL viewer.</h3>}
      <div className={classes.root}>
        {displayMolecules.sort(moleculeSorter(actions)).map(({ id, smiles, scores }, index) => {
          return (
            <MolCard
              key={index}
              elevation={isInNGLViewerIds.includes(id) ? 10 : undefined}
              smiles={smiles}
              onClick={() => toggleIsInNGLViewer(id)}
              onMouseLeave={() => setOpen(false)}
              actionsProps={{ className: classes.actionsRoot }}
              actions={(hover) => (
                <Grow in={hover || !!colours.filter((c) => c.id === id).length}>
                  <div>
                    <Tooltip arrow title={'Set Colour in NGL Viewer'}>
                      <IconButton
                        onMouseEnter={(e) => {
                          setAnchorEl(e.currentTarget);
                          setOpen(true);
                          setCurrentCardId(id);
                        }}
                        onMouseLeave={() => {
                          setAnchorEl(null);
                        }}
                        onClick={() => setOpen(!open)}
                      >
                        <PaletteIcon
                          style={{
                            color: getColour(id, colours),
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Grow>
              )}
            >
              <CalculationsTable properties={scores} fontSize={'0.6rem'} />
            </MolCard>
          );
        })}
        <Popper
          open={open}
          anchorEl={anchorEl}
          // anchorOrigin={{
          //   vertical: 'bottom',
          //   horizontal: 'center',
          // }}
          // transformOrigin={{
          //   vertical: 'top',
          //   horizontal: 'center',
          // }}
          // onClose={() => setOpen(false)}
          onMouseLeave={() => setOpen(false)}
          // disableRestoreFocus
        >
          <ColorPalette
            palette={palette}
            onSelect={(colour) => {
              currentCardId && setColour({ id: currentCardId, colour });
              setOpen(false);
            }}
          />
        </Popper>
      </div>
    </>
  );
};

export default CardView;

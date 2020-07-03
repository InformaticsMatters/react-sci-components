import { Grow, IconButton, Popover, Switch, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PaletteIcon from '@material-ui/icons/Palette';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { ColorPalette } from 'material-ui-color';
import React, { useState } from 'react';

import { usePlotSelection } from '../scatterplot/plotSelection';
import CalculationsTable from './CalculationsTable';
import {
  getColour,
  setColour,
  toggleIsInNGLViewer,
  toggleIsPinned,
  useCardActions,
} from './cardActions';
import MolCard from './MolCard';

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
      gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
      gridAutoRows: 'max-content',
      gridGap: '1rem',
      overflow: 'auto',
      padding: '1rem',
      height: '95vh',
    },
    actionsRoot: {
      display: 'block',
      position: 'absolute',
      top: -theme.spacing(1),
      left: 0,
      right: 0,
    },
  }),
);
interface IProps {}

const CardView = () => {
  const classes = useStyles();

  const selectedMolecules = usePlotSelection();
  const { isPinnedIds, isInNGLViewerIds, colours } = useCardActions();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  console.log(colours);

  return (
    <div className={classes.root}>
      {selectedMolecules.map(({ id, smiles, scores }, index) => {
        return (
          <MolCard
            key={index}
            elevation={isPinnedIds.includes(id) ? 10 : undefined}
            smiles={smiles}
            actionsProps={{ className: classes.actionsRoot }}
            actions={(hover) => (
              <Grow in={hover || open}>
                <div>
                  <Tooltip arrow title={'Star molecule'}>
                    <IconButton onClick={() => toggleIsPinned(id)}>
                      {isPinnedIds.includes(id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title={'Set Colour in NGL Viewer'}>
                    <IconButton
                      onMouseEnter={(e) => {
                        setAnchorEl(e.currentTarget);
                        setOpen(true);
                        setCurrentCardId(id);
                      }}
                      // onMouseLeave={() => setAnchorEl(null)}
                    >
                      <PaletteIcon
                        style={{
                          color: getColour(id, colours),
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title={'Toggle Visibility in NGL Viewer'}>
                    <Switch
                      size="small"
                      checked={isInNGLViewerIds.includes(id)}
                      onChange={() => toggleIsInNGLViewer(id)}
                      name="NGL Viewer"
                      inputProps={{ 'aria-label': 'Toggle view in NGL viewer' }}
                    />
                  </Tooltip>
                </div>
              </Grow>
            )}
          >
            <CalculationsTable properties={scores} fontSize={'0.6rem'} />
          </MolCard>
        );
      })}
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setOpen(false)}
        disableRestoreFocus
      >
        <ColorPalette
          palette={palette}
          onSelect={(colour) => currentCardId && setColour({ id: currentCardId, colour })}
        />
      </Popover>
    </div>
  );
};

export default CardView;

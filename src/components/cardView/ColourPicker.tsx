import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ColorButton } from 'material-ui-color';
import React from 'react';

interface IProps {
  colours: { [tooltip: string]: string };
  setColour: (_: string) => void;
  clearColour?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colours: {
      marginTop: theme.spacing(2),
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridGap: theme.spacing(1),
    },
  }),
);

const ColourPicker = ({ colours, setColour, clearColour }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.colours}>
      {Object.entries(colours).map(([tooltip, colour], index) => (
        <span
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            setColour(colour);
          }}
        >
          <ColorButton tooltip={tooltip} color={colour} />
        </span>
      ))}
      {clearColour && (
        <span
          onClick={(e) => {
            clearColour();
            e.stopPropagation();
          }}
        >
          <ColorButton tooltip="Remove Colour" color={''} />
        </span>
      )}
    </div>
  );
};

export default ColourPicker;

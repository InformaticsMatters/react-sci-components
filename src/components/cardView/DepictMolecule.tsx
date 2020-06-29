import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface Props {
  smiles: string;
  width?: number;
  height?: number;
  margin?: number;
  expand?: boolean;
  background?: string;
  colorScheme?: string;
  explicitHOnly?: boolean;
  highlightAtoms?: number[];
  highlightColor?: string;
  outerGlow?: boolean;
  mcs?: string;
  mcsColor?: string;
  noStereo?: boolean;
  alt?: string;
  fragnet_server?: string;
  depict_route?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      maxWidth: (props: Props) => (props.width ? props.width : '100%'),
      maxHeight: (props: Props) => (props.height ? props.height : '100%'),
    },
  }),
);

const DepictMolecule = (props: Readonly<Props>) => {
  const {
    smiles,
    width,
    height,
    margin = 0,
    expand = true,
    noStereo = false,
    mcs = '',
    mcsColor = '0xFFAAAAAA',
    fragnet_server = 'https://fragnet.informaticsmatters.com',
    depict_route = '/fragnet-depict/moldepict',
  } = props;

  const classes = useStyles(props);

  const params = {
    mol: smiles,
    ...(width && { w: String(width) }),
    ...(height && { h: String(height) }),
    m: String(margin),
    expand: String(expand),
    mcs: String(mcs),
    noStereo: String(noStereo),
    mcsColor,
  };
  const searchParams = Object.keys(params).map(
    (key) => `${key}=${encodeURIComponent(params[key as keyof typeof params])}`,
  );

  return (
    <img
      src={`${fragnet_server}${depict_route}?${searchParams.join('&')}`}
      alt={smiles}
      className={classes.image}
    />
  );
};

export default DepictMolecule;

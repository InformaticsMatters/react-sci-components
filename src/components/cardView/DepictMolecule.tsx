import React from 'react';

interface IProps {
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

const DepictMolecule = (props: Readonly<IProps>) => {
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

  const params = {
    mol: smiles,
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
      width={width}
      height={height}
      src={smiles && `${fragnet_server}${depict_route}?${searchParams.join('&')}`}
      alt={smiles || 'invalid smiles'}
    />
  );
};

export default DepictMolecule;

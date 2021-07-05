import React from 'react';

import styled from 'styled-components';

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
    <Image
      alt={smiles || 'invalid smiles'}
      height={height}
      loading="lazy"
      src={smiles && `${fragnet_server}${depict_route}?${searchParams.join('&')}`}
      width={width}
    />
  );
};

const Image = styled.img`
  overflow: hidden;
  display: inline-block;
  max-width: 100%;
  height: auto;
`;

export default DepictMolecule;

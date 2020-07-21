import React from 'react';

import styled from 'styled-components';

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
    <Image
      width={width}
      height={height}
      src={smiles && `${fragnet_server}${depict_route}?${searchParams.join('&')}`}
      alt={smiles || 'invalid smiles'}
    />
  );
};

export default DepictMolecule;

interface ImageExtraProps {
  height?: number;
  width?: number;
}

const Image = styled.img<ImageExtraProps>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  max-height: ${({ height }) => (height ? `${height}px` : '100%')};
`;

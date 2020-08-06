import React from 'react';

import { unzip, zip } from 'lodash';

import { Typography } from '@material-ui/core';

import CardViewConfig from './components/cardView/CardViewConfig';
import Configuration from './components/configuration/Configuration';
import DataLoader from './components/dataLoader/DataLoader';
import ScatterplotConfig from './components/scatterplot/ScatterplotConfig';
import Settings from './components/settings/Settings';
import { useMolecules } from './modules/molecules/molecules';

interface IProps {}

/**
 * Configuration modal for the Pose Viewer Mini App
 * This is a hard-coded example of a mini-app
 */
const PoseViewerConfig: React.FC<IProps> = () => {
  // Card View
  let { molecules, fieldNames, fieldNickNames, enabledFieldNames } = useMolecules();

  // Scatterplot
  [fieldNames = [], fieldNickNames = []] = unzip(
    zip(fieldNames, fieldNickNames).filter(([name]) => enabledFieldNames?.includes(name!)) as [
      string,
      string,
    ][],
  );

  return (
    <Configuration
      width={'50rem'}
      height={'80vh'}
      titles={['PDB Source', 'SDF Sources', 'Scatterplot', 'Card View']}
    >
      {/* PDB */}
      <Settings />
      {/* SDF */}
      <DataLoader />
      {/* Scatterplot */}
      <ScatterplotConfig title="Scatterplot" properties={[fieldNames, fieldNickNames]} />
      {/* Card View */}
      {!!molecules.length ? (
        <CardViewConfig title="Card View" />
      ) : (
        <Typography>No molecules are loaded yet</Typography>
      )}
    </Configuration>
  );
};

export default PoseViewerConfig;

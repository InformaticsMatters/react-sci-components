import React from 'react';

import { MIMETypes } from 'services/apiTypes';

import { Typography } from '@material-ui/core';

import CardViewConfig from './components/cardView/CardViewConfig';
import Configuration from './components/configuration/Configuration';
import DataLoader from './components/dataLoader/DataLoader';
import ScatterplotConfig from './components/scatterplot/ScatterplotConfig';
// import Settings from './components/settings/Settings';
import { useMolecules } from './modules/molecules/molecules';

interface IProps {}

/**
 * Configuration modal for the Pose Viewer Mini App
 * This is a hard-coded example of a mini-app
 */
const PoseViewerConfig: React.FC<IProps> = () => {
  // Card View / Scatterplot
  let { molecules, fields } = useMolecules();

  return (
    <Configuration
      width={'50rem'}
      height={'80vh'}
      titles={['PDB Source', 'SDF Sources', 'Scatterplot', 'Card View']}
    >
      {/* PDB */}
      <DataLoader title="pdb" fileType={MIMETypes.PDB} enableConfigs={false} />
      {/* SDF */}
      <DataLoader title="sdb" fileType={MIMETypes.SDF} enableConfigs />
      {/* Scatterplot */}
      <ScatterplotConfig title="Scatterplot" fields={fields} />
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

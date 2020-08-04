import React from 'react';

import { Typography } from '@material-ui/core';

import CardViewConfig from './components/cardView/CardViewConfig';
import { useCardViewConfiguration } from './components/cardView/cardViewConfiguration';
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
  const { fields, enabledFields, fieldForDepiction } = useCardViewConfiguration();
  const { molecules } = useMolecules();

  // Scatterplot
  const { fieldNames, fieldNickNames } = useMolecules();

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
        <CardViewConfig
          title="Card View"
          fields={fields}
          enabledFields={enabledFields}
          fieldForDepiction={fieldForDepiction}
        />
      ) : (
        <Typography>No molecules are loaded yet</Typography>
      )}
    </Configuration>
  );
};

export default PoseViewerConfig;

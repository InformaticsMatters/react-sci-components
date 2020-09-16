import React from 'react';

import { useProtein } from 'modules/protein/protein';
import { MIMETypes } from 'services/apiTypes';

import { ButtonProps, Typography } from '@material-ui/core';

import CardViewConfig from './components/cardView/CardViewConfig';
import MultiPage from './components/configuration/MultiPage';
import DataLoader from './components/dataLoader/DataLoader';
import ScatterplotConfig from './components/scatterplot/ScatterplotConfig';
import { useMolecules } from './modules/molecules/molecules';

interface IProps {}

/**
 * Configuration modal for the Pose Viewer Mini App
 * This is a hard-coded example of a mini-app
 */
const PoseViewerConfig = ({ ...buttonProps }: IProps & ButtonProps) => {
  // Card View / Scatterplot / DataLoader
  const {
    molecules,
    fields,
    totalParsed,
    isMoleculesLoading,
    moleculesErrorMessage,
  } = useMolecules();
  const { isProteinLoading, proteinErrorMessage } = useProtein();

  return (
    <MultiPage
      width={'52rem'}
      height={'80vh'}
      titles={['PDB Source', 'SDF Sources', 'Scatterplot', 'Card View']}
      buttonProps={buttonProps}
    >
      {/* PDB */}
      <DataLoader
        loading={isProteinLoading}
        error={proteinErrorMessage}
        title="pdb"
        fileType={MIMETypes.PDB}
        enableConfigs={false}
      />
      {/* SDF */}
      <DataLoader
        loading={isMoleculesLoading}
        error={moleculesErrorMessage}
        title="sdf"
        fileType={MIMETypes.SDF}
        enableConfigs
        totalParsed={totalParsed}
        moleculesKept={molecules.length}
      />
      {/* Scatterplot */}
      <ScatterplotConfig title="Scatterplot" fields={fields} />
      {/* Card View */}
      {!!molecules.length ? (
        <CardViewConfig title="Card View" />
      ) : (
        <Typography>No molecules are loaded yet</Typography>
      )}
    </MultiPage>
  );
};

export default PoseViewerConfig;

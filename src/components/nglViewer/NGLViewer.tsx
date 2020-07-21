import React from 'react';

import { useCardActions } from 'components/cardView/cardActions';

interface IProps {}

const NGLViewer = () => {
  const { colours } = useCardActions();

  const { isInNGLViewerIds } = useCardActions();

  return (
    <>
      <h4>IDs of molecules in NGL viewer</h4>
      <ul>
        {isInNGLViewerIds.map((id) => (
          <li>
            {id}: {colours.find((c) => c.id === id)?.colour ?? 'none'}
          </li>
        ))}
      </ul>
    </>
  );
};

export default NGLViewer;

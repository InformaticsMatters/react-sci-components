import styled from 'styled-components';

import { DialogContent, DialogTitle, IconButton, Tabs as MuiTabs } from '@material-ui/core';

export const Title = styled(DialogTitle)`
  min-width: 300px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

export const Tabs = styled(MuiTabs)`
  width: calc(100% - 4rem);
`;

export const Content = styled(DialogContent)`
  padding: ${({ theme }) => theme.spacing(2, 2)};
`;

export const CloseButton = styled(IconButton)`
  z-index: ${({ theme }) => theme.zIndex.appBar + 1};
  position: absolute;
  right: ${({ theme }) => theme.spacing(1)}px;
  top: 0;
  color: ${({ theme }) => theme.palette.grey[800]};
`;

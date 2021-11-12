import { List, styled } from '@material-ui/core';

/**
 * Styled MuiList component with a clamped height.
 */
export const ScrollList = styled(List)({
  minHeight: '100px',
  maxHeight: '30vh',
  overflowY: 'auto',
});

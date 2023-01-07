import type { ReactNode } from "react";
import React from "react";

import { Checkbox, ListItem, ListItemIcon, ListItemText, styled, Tooltip } from "@material-ui/core";
import FolderRoundedIcon from "@material-ui/icons/FolderRounded";

import type { SharedProps } from "./types";

export interface FileListItemProps {
  /**
   * Whether the item is a file or directory
   */
  type: SharedProps["targetType"];
  /**
   * Path to teh file or directory.
   */
  fullPath: string;
  /**
   * Text to display in the primary list item.
   */
  title: string;
  /**
   * Whether the item is currently selected
   */
  checked: boolean;
  /**
   * Icon to display for a directory
   */
  folderIcon?: ReactNode;
  /**
   * Called when a checkbox is clicked
   */
  onSelect?: (checked: boolean) => void;
  /**
   * Called when a list item is clicked
   */
  onClick?: () => void;
}

/**
 * MuiListItem that displays a file or directory with click actions to either select a file
 * or directory or navigate inside a directory.
 */
export const FileListItem = ({
  type,
  title,
  fullPath,
  checked,
  folderIcon,
  onClick,
  onSelect,
}: FileListItemProps) => {
  const labelId = `file-${fullPath}`;
  return (
    <ListItem button={!!onClick as any} key={fullPath} onClick={() => onClick && onClick()}>
      {!!onSelect && (
        <ListItemIcon>
          <SmallCheckbox
            checked={checked}
            edge="start"
            inputProps={{ "aria-labelledby": labelId }}
            size="small"
            onChange={(_event, checked) => onSelect(checked)}
            onClick={(event) => event.stopPropagation()}
          />
        </ListItemIcon>
      )}
      {type.startsWith("dir") && <ListItemIcon>{folderIcon ?? <FolderRoundedIcon />}</ListItemIcon>}
      <Tooltip title={title}>
        <ListItemText id={labelId} primary={title} primaryTypographyProps={{ noWrap: true }} />
      </Tooltip>
    </ListItem>
  );
};

const SmallCheckbox = styled(Checkbox)({
  paddingTop: 0,
  paddingBottom: 0,
});

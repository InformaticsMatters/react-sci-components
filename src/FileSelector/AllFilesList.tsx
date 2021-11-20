import React, { useState } from 'react';

import { useGetFiles } from '@squonk/data-manager-client/file';

import { Typography } from '@material-ui/core';

import { CenterLoader } from '../CenterLoader';
import { FileListItem } from './FileListItem';
import { PathBreadcrumbs } from './PathBreadcrumbs';
import { ScrollList } from './ScrollList';
import type { SavedFile, SharedProps } from './types';
import { getFullPath } from './utils';

/**
 * Navigable list of files in the project volume in a list format with options to select files or
 * directories
 */
export const AllFilesList = ({
  projectId,
  value,
  targetType,
  onSelect,
  multiple,
  mimeTypes,
  extensions,
}: SharedProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const subPath = '/' + breadcrumbs.join('/');

  const { data, isLoading } = useGetFiles({
    project_id: projectId,
    path: subPath,
  });

  const files =
    data?.files.filter((file) => extensions.some((ext) => file.file_name.endsWith(ext))) ?? [];
  const dirs = (data?.paths ?? []).map((path): SavedFile => ({ path, type: 'directory' }));

  if (isLoading) {
    return (
      <>
        <PathBreadcrumbs breadcrumbs={breadcrumbs} setBreadcrumbs={setBreadcrumbs} />
        <CenterLoader />
      </>
    );
  }

  if (files.length === 0 && dirs.length === 0) {
    return (
      <>
        <PathBreadcrumbs breadcrumbs={breadcrumbs} setBreadcrumbs={setBreadcrumbs} />
        <Typography align="center" variant="body2">
          No files or directories
        </Typography>
      </>
    );
  }

  return (
    <>
      <PathBreadcrumbs breadcrumbs={breadcrumbs} setBreadcrumbs={setBreadcrumbs} />
      <ScrollList dense>
        {dirs.map(({ path }) => {
          const fullPath = getFullPath(breadcrumbs, path);
          return (
            <FileListItem
              checked={!!value.find((savedFile) => savedFile.path === fullPath)}
              fullPath={fullPath}
              key={path}
              title={path}
              type="directory"
              onClick={() => setBreadcrumbs([...breadcrumbs, path])}
            />
          );
        })}
        {(targetType === 'file' ? files : []).map((file) => {
          const fullPath = getFullPath(breadcrumbs, file.file_name);
          const handleSelect = (): void => {
            const savedFile: SavedFile = { path: fullPath, type: 'file', mimeType: file.mime_type };
            let payload: SavedFile[];
            if (multiple) {
              payload = [...value.filter((f) => f.path === fullPath), savedFile];
            } else {
              payload = [savedFile];
            }
            return onSelect(payload);
          };
          return (
            <FileListItem
              checked={!!value.find((savedFile) => savedFile.path === fullPath)}
              fullPath={fullPath}
              key={file.file_name}
              title={file.file_name}
              type="file"
              onClick={handleSelect}
              onSelect={handleSelect}
            />
          );
        })}
      </ScrollList>
    </>
  );
};

type ProjectId = string;
export type NoUndefProjectId = NonNullable<ProjectId>;
export type FileOrDirectory = 'file' | 'directory';

export type SavedFile = {
  path: string;
  type: 'file' | 'directory';
  mimeType?: string;
};

export interface SharedProps {
  /**
   * Whether the input is for a file or directory. This filters the options.
   */
  targetType: FileOrDirectory;
  /**
   * File MimeTypes by which files are filtered. Files that have no mime-type are not filtered here.
   * Use extensions to be more specific.
   */
  mimeTypes: string[];
  /**
   * File extensions by which files are filtered.
   */
  extensions: string[];
  /**
   * Whether more than one file can be selected.
   */
  multiple: boolean;
  /**
   * ID of the project from which files are supplied.
   */
  projectId: NoUndefProjectId;
  /**
   * Array of currently selected files.
   */
  value: SavedFile[];
  /**
   * Called when a file selection is made.
   */
  onSelect: (selection: SavedFile[]) => void;
}

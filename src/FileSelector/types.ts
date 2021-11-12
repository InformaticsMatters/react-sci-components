type ProjectId = string;
export type NoUndefProjectId = NonNullable<ProjectId>;
export type FileOrDirectory = 'file' | 'directory';
export type Selection = string[] | string | undefined;

export type SavedFile = {
  path: string;
  type: 'file' | 'directory';
  mimeType?: string;
};

export interface SharedProps {
  /**
   * Array of currently selected files.
   */
  selectedFiles: SavedFile[];
  /**
   * Whether the input is for a file or directory. This filters the options.
   */
  targetType: FileOrDirectory;
  /**
   * File MimeTypes by which files are filtered.
   */
  mimeTypes?: string[];
  /**
   * Whether more than one file can be selected.
   */
  multiple: boolean;
  /**
   * ID of the project from which files are supplied.
   */
  projectId: NoUndefProjectId;
  /**
   * Selected file path or paths
   */
  value?: string | string[];
  /**
   * Called when a file selection is made.
   */
  onSelect: (selection: Selection) => void;
}

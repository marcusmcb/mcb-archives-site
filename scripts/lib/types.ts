export type ShowSong = {
  title: string;
  artist: string;
};

export type ShowYaml = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
  genres: string[];
  /** Optional array of decade labels (e.g. ["2000s"]). Some files may use `decade` instead. */
  decade?: string[];
  /** Preferred field name for decade labels (e.g. ["2000s"]). */
  decades?: string[];
  original_broadcast: string;
  original_broadcast_display?: string;
  station: string;
  duration_seconds?: number;
  songs: ShowSong[];
};

export type ShowDoc = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
  genres: string[];
  decades: string[];
  original_broadcast: Date;
  original_broadcast_display?: string;
  station: string;
  duration_seconds?: number;
  songs: ShowSong[];
  searchText: string;
  sourcePath: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
};

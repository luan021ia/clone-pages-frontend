export interface CleaningPolicy {
  preserveGTM?: boolean;
  preserveFacebookPixel?: boolean;
  preserveGoogleFonts?: boolean;
  preserveMetaViewport?: boolean;
  preserveMetaRobots?: boolean;
  preserveRSSFeeds?: boolean;
  removeToolArtifacts?: boolean;
}

export const defaultCleaningPolicy: Required<CleaningPolicy> = {
  preserveGTM: true,
  preserveFacebookPixel: true,
  preserveGoogleFonts: true,
  preserveMetaViewport: true,
  preserveMetaRobots: true,
  preserveRSSFeeds: true,
  removeToolArtifacts: true,
};
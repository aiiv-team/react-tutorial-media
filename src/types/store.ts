import { VideoPlayState } from "./video";

export type VideoState = {
  uri: string | null;
  videoRef: HTMLVideoElement | null;
  isControlPanelVisible: boolean;
  isSeekingForward: boolean;
  isSeekingBackward: boolean;
  playState: VideoPlayState;
  duration: number;
  position: number;
};

export type RootState = {
  video: VideoState;
};

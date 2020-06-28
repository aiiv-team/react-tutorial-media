import { VideoState, RootState } from "../../types/store";
import { VideoPlayState } from "../../types/video";
import { ThunkAction } from "redux-thunk";

const SET_URI = "video/setUri" as const;
const LOAD_START = "video/loadStart" as const;
const LOAD = "video/load" as const;
const TOGGLE_CONTROL_PANEL = "video/toggleControlPanel" as const;
const SHOW_CONTROL_PANEL = "video/showControlPanel" as const;
const HIDE_CONTROL_PANEL = "video/hideControlPanel" as const;
const SET_PLAY_STATE = "video/setPlayState" as const;
const UPDATE_PLAY_STATUS = "video/updatePlayStatus" as const;
const SET_IS_SEEKING_FORWARD = "video/setIsSeekingForward" as const;
const SET_IS_SEEKING_BACKWARD = "video/setIsSeekingBackward" as const;

const initialState: VideoState = {
  uri: null,
  videoRef: null,
  isControlPanelVisible: true,
  isSeekingForward: false,
  isSeekingBackward: false,
  playState: VideoPlayState.Paused,
  duration: 0,
  position: 0,
};

const setUri = (uri: string) => ({ type: SET_URI, uri });
export const loadStart = () => ({ type: LOAD_START });
export const load = (videoRef: HTMLVideoElement) => ({ type: LOAD, videoRef });
export const toggleControlPanel = () => ({
  type: TOGGLE_CONTROL_PANEL,
});
export const showControlPanel = () => ({ type: SHOW_CONTROL_PANEL });
export const hideControlPanel = () => ({
  type: HIDE_CONTROL_PANEL,
});
const setPlayState = (videoPlayState: VideoPlayState) => ({
  type: SET_PLAY_STATE,
  videoPlayState,
});
export const updatePlayStatus = (
  duration: number | undefined,
  position: number,
  isPlaying: boolean,
  isPending: boolean
) => ({
  type: UPDATE_PLAY_STATUS,
  duration,
  position,
  isPlaying,
  isPending,
});
const setIsSeekingForward = (value: boolean) => ({
  type: SET_IS_SEEKING_FORWARD,
  value,
});
const setIsSeekingBackward = (value: boolean) => ({
  type: SET_IS_SEEKING_BACKWARD,
  value,
});

type VideoAction =
  | ReturnType<typeof setUri>
  | ReturnType<typeof loadStart>
  | ReturnType<typeof load>
  | ReturnType<typeof toggleControlPanel>
  | ReturnType<typeof showControlPanel>
  | ReturnType<typeof hideControlPanel>
  | ReturnType<typeof setPlayState>
  | ReturnType<typeof updatePlayStatus>
  | ReturnType<typeof setIsSeekingForward>
  | ReturnType<typeof setIsSeekingBackward>;

// const SHOW_SPINNER_TIMEOUT = 500; // ms
const TOGGLE_CONTROL_PANEL_TIMEOUT = 2000; // ms
export const USE_LONG_INTERVAL_THRESHOLD = 60000; // ms
const JUMP_INTERVAL_LONG = 10000; // ms
const JUMP_INTERVAL_SHORT = 5000; // ms
const SHOW_SEEKING_ICON_INTERVAL = 500; // ms
let timeout: NodeJS.Timeout | undefined;
let timeoutHandler: () => void;

export const clearControlPanelTimeout = () => {
  if (timeout !== undefined) {
    clearTimeout(timeout);
    timeout = undefined;
  }
};

export const toggleControlPanelWithTimeout = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const { isControlPanelVisible, playState } = getState().video;
    dispatch(toggleControlPanel());
    timeoutHandler = () => {
      dispatch(toggleControlPanel());
    };
    if (!isControlPanelVisible && playState === VideoPlayState.Playing) {
      timeout = setTimeout(timeoutHandler, TOGGLE_CONTROL_PANEL_TIMEOUT);
    } else {
      clearControlPanelTimeout();
    }
  };
};

export const playVideo = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const videoRef = getState().video.videoRef;
    if (!videoRef) {
      return;
    }
    dispatch(setPlayState(VideoPlayState.Pending));
    await videoRef.play().then(() => {
      dispatch(setPlayState(VideoPlayState.Playing));
      dispatch(hideControlPanel());
    });
  };
};

export const pauseVideo = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const videoRef = getState().video.videoRef;
    if (!videoRef) {
      return;
    }
    videoRef.pause();
    dispatch(setPlayState(VideoPlayState.Paused));
  };
};

export const seekVideo = (
  seekProgress: number
): ThunkAction<Promise<void>, RootState, null, VideoAction> => {
  return async (dispatch, getState) => {
    const { videoRef, duration } = getState().video;
    if (!videoRef || duration === undefined) {
      return;
    }
    const clamppedProgress = Math.max(0, Math.min(1, seekProgress));
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutHandler, TOGGLE_CONTROL_PANEL_TIMEOUT);
    }
    // const ifLoadingTakesTimeHandler = () =>
    //   dispatch(setPlayState(VideoPlayState.Pending));
    // const spinnerTimeout = setTimeout(
    //   ifLoadingTakesTimeHandler,
    //   SHOW_SPINNER_TIMEOUT
    // );

    videoRef.currentTime = duration * clamppedProgress;
    // clearTimeout(spinnerTimeout);
    // dispatch(setPlayState(playState));
  };
};

export const seekVideoForward = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const { videoRef, duration, position } = getState().video;
    if (!videoRef || duration === undefined) {
      return;
    }
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutHandler, TOGGLE_CONTROL_PANEL_TIMEOUT);
    }
    // const ifLoadingTakesTimeHandler = () =>
    //   dispatch(setPlayState(VideoPlayState.Pending));
    // const spinnerTimeout = setTimeout(
    //   ifLoadingTakesTimeHandler,
    //   SHOW_SPINNER_TIMEOUT
    // );
    const seekPosition = Math.min(
      duration,
      position +
        (duration >= USE_LONG_INTERVAL_THRESHOLD
          ? JUMP_INTERVAL_LONG
          : JUMP_INTERVAL_SHORT)
    );

    dispatch(setIsSeekingForward(true));
    setTimeout(
      () => dispatch(setIsSeekingForward(false)),
      SHOW_SEEKING_ICON_INTERVAL
    );
    videoRef.currentTime = seekPosition;
    // clearTimeout(spinnerTimeout);
    // dispatch(setPlayState(playState));
  };
};

export const seekVideoBackward = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const { videoRef, duration, position } = getState().video;
    if (!videoRef || duration === undefined) {
      return;
    }
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutHandler, TOGGLE_CONTROL_PANEL_TIMEOUT);
    }
    // const ifLoadingTakesTimeHandler = () =>
    //   dispatch(setPlayState(VideoPlayState.Pending));
    // const spinnerTimeout = setTimeout(
    //   ifLoadingTakesTimeHandler,
    //   SHOW_SPINNER_TIMEOUT
    // );
    const seekPosition = Math.max(
      0,
      position -
        (duration >= USE_LONG_INTERVAL_THRESHOLD
          ? JUMP_INTERVAL_LONG
          : JUMP_INTERVAL_SHORT)
    );

    dispatch(setIsSeekingBackward(true));
    setTimeout(
      () => dispatch(setIsSeekingBackward(false)),
      SHOW_SEEKING_ICON_INTERVAL
    );
    videoRef.currentTime = seekPosition;
    // clearTimeout(spinnerTimeout);
    // dispatch(setPlayState(playState));
  };
};

export const resetVideo = (): ThunkAction<
  Promise<void>,
  RootState,
  null,
  VideoAction
> => {
  return async (dispatch, getState) => {
    const videoRef = getState().video.videoRef;
    if (!videoRef) {
      return;
    }
    videoRef.currentTime = 0;
    videoRef.pause();
    dispatch(setPlayState(VideoPlayState.Paused));
    dispatch(showControlPanel());
  };
};

const videoReducer = (
  state: VideoState = initialState,
  action: VideoAction
): VideoState => {
  switch (action.type) {
    case SET_URI:
      return { ...state, uri: action.uri };
    case LOAD_START:
      return { ...state, playState: VideoPlayState.Pending };
    case LOAD:
      return { ...initialState, uri: state.uri, videoRef: action.videoRef };
    case TOGGLE_CONTROL_PANEL:
      return { ...state, isControlPanelVisible: !state.isControlPanelVisible };
    case SHOW_CONTROL_PANEL:
      return { ...state, isControlPanelVisible: true };
    case HIDE_CONTROL_PANEL:
      return { ...state, isControlPanelVisible: false };
    case SET_PLAY_STATE:
      return { ...state, playState: action.videoPlayState };
    case UPDATE_PLAY_STATUS:
      return {
        ...state,
        duration:
          action.duration !== undefined ? action.duration : state.duration,
        position: action.position,
        playState: action.isPending
          ? VideoPlayState.Paused
          : action.isPlaying
          ? VideoPlayState.Playing
          : VideoPlayState.Paused,
      };
    case SET_IS_SEEKING_FORWARD:
      return {
        ...state,
        isSeekingForward: action.value,
        isSeekingBackward: action.value ? false : state.isSeekingBackward,
      };
    case SET_IS_SEEKING_BACKWARD:
      return {
        ...state,
        isSeekingForward: action.value ? false : state.isSeekingForward,
        isSeekingBackward: action.value,
      };
    default:
      return state;
  }
};

export default videoReducer;

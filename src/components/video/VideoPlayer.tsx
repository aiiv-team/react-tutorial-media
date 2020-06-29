import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../types/store";
import {
  loadStart,
  load,
  updatePlayStatus,
  resetVideo,
} from "../../store/modules/video";

const DEMO_VIDEO_SOURCE =
  "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4";

const Video = styled.video`
  width: 100%;
  height: 100%;

  background-color: #000000;
`;

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoUri = useSelector((state: RootState) => state.video.uri);

  const onLoadStart = () => {
    dispatch(loadStart());
  };
  const onLoad = () => {
    if (videoRef.current) {
      dispatch(load(videoRef.current));
    }
  };
  const onEnded = () => {
    dispatch(resetVideo());
  };

  React.useEffect(() => {
    function onStatusUpdate() {
      if (videoRef.current) {
        const { currentTime, seeking, duration, paused } = videoRef.current;
        dispatch(updatePlayStatus(duration, currentTime, !paused, seeking));
      }
    }
    const handle = setInterval(onStatusUpdate, 500);
    return () => clearInterval(handle);
  }, [dispatch]);

  return (
    <Video
      src={videoUri || DEMO_VIDEO_SOURCE}
      ref={videoRef}
      onLoadStart={onLoadStart}
      onLoadedData={onLoad}
      onEnded={onEnded}
    />
  );
};

export default VideoPlayer;

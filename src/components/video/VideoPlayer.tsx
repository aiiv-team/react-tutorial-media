import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../types/store";

const DEMO_VIDEO_SOURCE =
  "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4";

const Video = styled.video`
  width: 100%;
  height: 100%;

  background-color: #000000;
`;

const VideoPlayer = () => {
  const videoUri = useSelector((state: RootState) => state.video.uri);
  return (
    <Video src={videoUri || DEMO_VIDEO_SOURCE} autoPlay={true} loop={true} />
  );
};

export default VideoPlayer;

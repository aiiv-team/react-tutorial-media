import React from "react";
import styled from "styled-components";
import { VideoPlayState } from "../../types/video";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../types/store";
import { playVideo, pauseVideo } from "../../store/modules/video";
import Spinner from "./Spinner";

function getIconName(videoPlayState: VideoPlayState) {
  switch (videoPlayState) {
    case VideoPlayState.Paused:
      return "play_arrow";
    case VideoPlayState.Playing:
      return "pause";
    default:
      return "";
  }
}

const StyledButton = styled.button`
  background: transparent;
  padding: 8px;
  border: none;
  outline: none;
`;

const PlayButton = () => {
  const dispatch = useDispatch();
  const videoPlayState = useSelector(
    (state: RootState) => state.video.playState
  );

  const onPress = (event: React.MouseEvent) => {
    switch (videoPlayState) {
      case VideoPlayState.Paused:
        dispatch(playVideo());
        break;
      case VideoPlayState.Playing:
        dispatch(pauseVideo());
        break;
      default:
        break;
    }
    event.stopPropagation();
  };

  return videoPlayState === VideoPlayState.Pending ? (
    <Spinner size={36} inverted={true} />
  ) : (
    <StyledButton onClick={onPress}>
      <i className="material-icons md-48 md-light">
        {getIconName(videoPlayState)}
      </i>
    </StyledButton>
  );
};

export default PlayButton;

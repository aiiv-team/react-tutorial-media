import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../types/store";
import { seekVideo } from "../../store/modules/video";

const PROGRESS_CONTAINER_HORIZONTAL_PADDING = 16;
const PROGRESS_BAR_SIZE = 12;
const PROGRESS_TRACK_HEIGHT = 2;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 ${PROGRESS_CONTAINER_HORIZONTAL_PADDING}px 8px
    ${PROGRESS_CONTAINER_HORIZONTAL_PADDING}px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  color: #ffffff;
  margin: 0 0 8px 0;
  font-size: 12px;
`;

const Bar = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Track = styled.div`
  width: 100%;
  height: ${PROGRESS_TRACK_HEIGHT}px;
  background-color: rgba(255, 255, 255, 0.3);
`;

const Rail = styled.div`
  position: absolute;
  left: 0;
  top: ${0.5 * (PROGRESS_BAR_SIZE - PROGRESS_TRACK_HEIGHT)}px;
  height: ${PROGRESS_TRACK_HEIGHT}px;
  background-color: #81d4fa;
`;

const Knob = styled.div`
  position: absolute;
  top: 0;
  width: ${PROGRESS_BAR_SIZE}px;
  height: ${PROGRESS_BAR_SIZE}px;
  border-radius: ${0.5 * PROGRESS_BAR_SIZE}px;
  background-color: #81d4fa;
  transform: translateX(-${0.5 * PROGRESS_BAR_SIZE}px);
`;

function padDigits(number: number, digits: number) {
  return (
    Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number
  );
}

const formatTime = (time: number) => {
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time) % 60;
  return [
    ...(hours ? [hours] : []),
    hours ? padDigits(minutes, 2) : minutes,
    padDigits(seconds, 2),
  ].join(":");
};

const ProgressBar = () => {
  const dispatch = useDispatch();
  const videoDuration = useSelector((state: RootState) => state.video.duration);
  const videoPosition = useSelector((state: RootState) => state.video.position);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const percentage = videoDuration
    ? (videoPosition / videoDuration) * 100
    : null;

  const railStyle = { width: percentage ? `${percentage}%` : 0 };
  const knobStyle = { left: percentage ? `${percentage}%` : 0 };

  const onPress = (event: React.MouseEvent) => {
    if (!containerRef.current) {
      return;
    }
    const { clientWidth: containerWidth } = containerRef.current;
    const { pageX } = event;
    if (
      pageX < 0.5 * PROGRESS_CONTAINER_HORIZONTAL_PADDING ||
      pageX > containerWidth - 0.5 * PROGRESS_CONTAINER_HORIZONTAL_PADDING
    ) {
      return;
    }
    const progress =
      (pageX - 0.5 * PROGRESS_CONTAINER_HORIZONTAL_PADDING) /
      (containerWidth - 0.5 * PROGRESS_CONTAINER_HORIZONTAL_PADDING);
    dispatch(seekVideo(progress));
  };

  return (
    <Container ref={containerRef} onClick={onPress}>
      {videoDuration !== undefined && (
        <Text>{`${formatTime(videoPosition)} / ${formatTime(
          videoDuration
        )}`}</Text>
      )}
      <Bar>
        <Track />
        <Rail style={railStyle} />
        <Knob style={knobStyle} />
      </Bar>
    </Container>
  );
};

export default ProgressBar;

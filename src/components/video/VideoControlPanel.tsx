import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../types/store";
import {
  toggleControlPanelWithTimeout,
  seekVideoForward,
  seekVideoBackward,
} from "../../store/modules/video";

const StyledContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  transition: opacity ease 0.15s;
  ${({ isVisible }) => `opacity: ${isVisible ? 1 : 0};`}
`;
const DOUBLE_TAP_THRESHOLD = 300; // ms

const VideoControlPanel = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.video.isControlPanelVisible
  );
  const doubleTapTimeoutRef: React.MutableRefObject<
    number | null
  > = React.useRef<number>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onSingleTap = (event: React.MouseEvent) =>
    dispatch(toggleControlPanelWithTimeout());
  const onDoubleTap = (event: React.MouseEvent) => {
    if (!containerRef.current) {
      return;
    }

    if (event.screenX > 0.5 * containerRef.current.clientWidth) {
      dispatch(seekVideoForward());
    } else {
      dispatch(seekVideoBackward());
    }
  };

  const onPress = (event: React.MouseEvent) => {
    if (!isVisible) {
      onSingleTap(event);
    } else {
      if (doubleTapTimeoutRef.current !== null) {
        // handle double tap
        clearTimeout(doubleTapTimeoutRef.current);
        doubleTapTimeoutRef.current = null;
        onDoubleTap(event);
      } else {
        doubleTapTimeoutRef.current = setTimeout(() => {
          onSingleTap(event);
          doubleTapTimeoutRef.current = null;
        }, DOUBLE_TAP_THRESHOLD);
      }
    }
  };

  return (
    <StyledContainer
      isVisible={isVisible}
      ref={containerRef}
      onClick={onPress}
    />
  );
};

export default VideoControlPanel;

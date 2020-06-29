import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setUri, pauseVideo } from "../../store/modules/video";

const Menu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 8px 16px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const TopMenu = () => {
  const dispatch = useDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onPressLoadVideo = (e: React.MouseEvent) => {
    dispatch(pauseVideo());
    e.stopPropagation();
  };

  const onLoadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files ? e.currentTarget.files[0] : null;
    const uri = URL.createObjectURL(file);
    dispatch(setUri(uri));
    e.currentTarget.value = "";
  };

  return (
    <Menu>
      <label htmlFor="load-video" onClick={onPressLoadVideo}>
        <i className="material-icons md-24 md-light">more_vert</i>
      </label>
      <input
        id="load-video"
        type="file"
        accept="video/*"
        ref={inputRef}
        onClick={(e) => e.stopPropagation()}
        onChange={onLoadVideo}
        style={{ display: "none" }}
      />
    </Menu>
  );
};

export default TopMenu;

import React from "react";
import VideoPlayer from "./components/video/VideoPlayer";
import VideoControlPanel from "./components/video/VideoControlPanel";

const App = () => {
  return (
    <React.Fragment>
      <VideoPlayer />
      <VideoControlPanel />
    </React.Fragment>
  );
};

export default App;

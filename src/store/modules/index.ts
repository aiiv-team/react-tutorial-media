import { combineReducers } from "redux";
import videoReducer from "./video";

const rootReducer = combineReducers({
  video: videoReducer,
});

export default rootReducer;

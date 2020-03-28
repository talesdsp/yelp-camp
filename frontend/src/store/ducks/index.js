import {combineReducers} from "redux";
import pagesReducer from "./page";
import usersReducer from "./user";

// log every dispatch
const common = (state = {}, action) => {
  console.log("dispatching:", action);
  return state;
};

const rootReducer = combineReducers({common, users: usersReducer, pages: pagesReducer});
export default rootReducer;

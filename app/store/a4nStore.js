
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import asyncAwait from 'redux-async-await';
import userManagement from "./reducers/user";
import database from "./reducers/database";
import globalStateManagement from "./reducers/global";
import progressManagement from "./reducers/progress";
import scanStatus from "./reducers/scan";

const middleWare = [thunk,asyncAwait];
export default createStore(combineReducers({
        progressManagement,
        globalStateManagement,
        userManagement,
        localDatabase: database,
        scanStatus
    }),applyMiddleware(...middleWare));
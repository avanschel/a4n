
import {
    LOCAL_DB_INIT,
    LOCAL_DB_CREATE_TABLE,
    IMPORT_RETRIEVE_ASSETS_TYPE,
    IMPORT_FINISHED,
    SET_TABLE_LIST, SET_CURRENT_DATA, SET_CURRENT_HEADER
} from '../actions/actions';
import {createTableAfmFlds, getLocalParam, openLocalDatabase} from "../../api/database";

import {initialState} from "../initialState";
function database(state=initialState.database, action){
    let nextState;
    switch(action.type){
        case LOCAL_DB_INIT:
            const response = openLocalDatabase(state.dbName);
            nextState = {...state,error: response.error,db:response.db,initialized:response.initialized,loading:response.loading};
            if(nextState.loading.loading){
                const error =createTableAfmFlds(nextState.db);
                let param = false;
                if(!error){
                    param = getLocalParam(nextState.db);
                }
            }
            return nextState;
        case LOCAL_DB_CREATE_TABLE:
            const error =createTableAfmFlds(state.db);
            let param = false;
            if(!error){
                param = getLocalParam(state.db);
            }
            nextState = {...state,loading:false,error:error,archibus:param};
            return nextState;
        case SET_TABLE_LIST:
            nextState = {...state,tables:action.tables};
            return nextState;
        case SET_CURRENT_DATA:
            return action.state;
        case SET_CURRENT_HEADER:
            return action.state;
        default:
            return state;
    }
}
export default database;
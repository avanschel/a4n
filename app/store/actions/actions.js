export const INIT_APP = 'INIT_APP';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const SET_LOCAL_PARAM = 'SET_LOCAL_PARAM';
export const LOCAL_DB_INIT = 'LOCAL_DB_INIT';
export const LOCAL_DB_CREATE_TABLE = 'LOCAL_DB_CREATE_TABLE';
export const SET_LOCAL_PARAMS ='SET_LOCAL_PARAMS';
export const IMPORT_RETRIEVE_ASSETS_TYPE='IMPORT_RETRIEVE_ASSETS_TYPE';
export const IMPORT_FINISHED='IMPORT_FINISHED';
export const PROGRESS_RUNNING ='PROGRESS_RUNNING';
export const PROGRESS_UPDATE ='PROGRESS_UPDATE';
export const PROGRESS_FINISHED='PROGRESS_FINISHED';
export const SET_TABLE_LIST='SET_TABLE_LIST';
export const SET_CURRENT_DATA='SET_CURRENT_DATA';
export const SET_CURRENT_HEADER='SET_CURRENT_HEADER';
export const SCAN_CODE_BAR_CHANGE='SCAN_CODE_BAR_CHANGE';
export const SCAN_CONTAINER_CHANGE='SCAN_CONTAINER_CHANGE';
export const SCAN_DEF_FIELD='SCAN_DEF_FIELD';
export const SCAN_SET_SURVEY='SCAN_SET_SURVEY';
export const SCAN_SET_STATE='SCAN_SET_STATE';
/*User reducer ------------------------------ */
export function onLoginPending() {
    return {
        type: LOGIN_PENDING
    }
}
export function onLoginSuccess(data) {
    return {
        type: LOGIN_SUCCESS,
        data:data
    }
}
export function onLoginError(error) {
    return {
        type: LOGIN_ERROR,
        error:error
    }
}

export function setLocalParams(db,params) {
    return {
        type: SET_LOCAL_PARAMS,
        db:db,
        params: params
    }
}
export function setLocalParam(data){
    return{
        type: SET_LOCAL_PARAM,
        value:data
    }

}

/* Database reducers --------------------------------------*/
export function initializeLocalDatabase(){
    return {
        type: LOCAL_DB_INIT
    }
}
export function createParamTableLocalDatabase(){
    return {
        type: LOCAL_DB_CREATE_TABLE
    }
}

export function initApplication(state){
    return {
        type: INIT_APP,
        state:state
    }
}
export function endProgress(state){
    return {
        type:PROGRESS_FINISHED,
        state:state
    }
}
export function setCurrentData(state){
    return{
        type:SET_CURRENT_DATA,
        state:state
    }
}
export function setCurrentHeader(state){
    return{
        type:SET_CURRENT_HEADER,
        state:state
    }
}
export function setNewCodeBar(state){
    return {
        type:SCAN_CODE_BAR_CHANGE,
        state:state
    }
}
export function setNewContainer(state){
    return {
        type:SCAN_CONTAINER_CHANGE,
        state:state
    }
}
export function setScanDefFields(state){
    return {
        type:SCAN_DEF_FIELD,
        state:state
    }
}
export function setSurvey(state){
    return {
        type:SCAN_SET_SURVEY,
        state:state
    }
}
export function setScanState(state){
    return{
        type:SCAN_SET_STATE,
        state:state
    }
}
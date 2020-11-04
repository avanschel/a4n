/* Reducer for the management of local data */
import {LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_PENDING, LOGOUT, SET_LOCAL_PARAM, SET_LOCAL_PARAMS} from '../actions/actions';
import {setParameter} from "../actions/user";
import {initialState} from "../initialState";
import {setLocalParams} from "../../api/database";
function userManagement(state=initialState.user,action){
    let nextState;
    let error;
    let loading;
    let logged;
    switch(action.type){
        case LOGIN_PENDING:
            error = {error:false,title:'Login error',message:'An error occured while tryin to connect.'};
            nextState = {...state,error:error,loading:{loading:true,message:'Trying to connect...'}};
            return nextState;
        case LOGIN_SUCCESS:
            if(action.data.hasOwnProperty('auth')){
                if(action.data.auth ==='KO'){
                    logged=false;
                    error = {error:true,title:'Login error',message:'The server is good, but bad credentials'};
                }else{
                    logged=true;
                    error = {error:false,title:'Login error',message:'The server is good, but bad credentials'};
                }
            }else{
                logged=false;
                error = {error:true,title:'Login error',message:'The server is good, but bad credentials'};
            }
            nextState = {...state,logged:logged,loading:{loading:false,message:null},error:error};
            return nextState;
        case LOGIN_ERROR:
            error = {error:true,title:'Login error',message:"Can't connect to server."};
            nextState = {...state,loading:{loading:false,message:null},error:error};
            return nextState;
        case LOGOUT:
            //Execute custom code for the initialization
            nextState = {...state,logged: false};
            return nextState;
        case SET_LOCAL_PARAM:
            const data =  setParameter(action.value,{username:state.username,password:state.password,server:state.server});
            nextState = {...state,initialized:true,username:data.username,password:data.password,server:data.server,logged: false};
            return nextState;
        case SET_LOCAL_PARAMS:
            setLocalParams(action.db,action.params);
            nextState = {...state,logged: true};
            return state;
        default:
            return state;
    }
}
export default userManagement;

import {getListOfTable, getListOfTableAndCount} from "./database";
import {SET_TABLE_LIST, setCurrentData, setCurrentHeader} from "../store/actions/actions";
import {asyncRetrieveAssets} from "./assets";
import {SURV_PREFIX} from "../../constante";

export async function retrieveListOfTable(db,dispatch,state){
    return new Promise(resolve=>{
        getListOfTableAndCount(db).then(res=>{
            resolve({type:SET_TABLE_LIST,tables:res});
        }).catch((err)=>{
            resolve({type:SET_TABLE_LIST,tables:[]});
        });
    });
}
export async function setTheCurrentHeaderToProps(dispatch,state,tableName,currentHeader){
    return new Promise(resolve=>{
        let nextState ={...state,currentTable:tableName,currentHeader:currentHeader,firstLoadData: false,currentData:[], currentPage:0};
        //dispatch(setCurrentHeader(nextState));
        resolve(setCurrentHeader(nextState));
    });
}
export async function setCurrentDataToProps(dispatch,state,currentData,currentPage,reset){
    return new Promise(resolve=>{
        let nextState;
        if(reset){
            nextState ={...state,firstLoadData: true,currentData:currentData, currentPage:0};
        }else{
            nextState ={...state,firstLoadData: true,currentData:state.currentData.concat(currentData), currentPage:currentPage};
        }
       //dispatch(setCurrentData(nextState));
        resolve(setCurrentData(nextState));
    });
}
import {
    createTableAfmFlds,
    getListOfTable,
    getListOfTableAndCount,
    getLocalParam,
    openLocalDatabase
} from "../../api/database";
import {generateUserNextState, getUserObj, setParameter} from "./user";

export function initApp(state){
    return new Promise((resolve,reject)=>{
        const response = openLocalDatabase(state.database.dbName);
        let nextState= state;
        nextState.database.error = response.error;
        nextState.database.db = response.db;
        nextState.database.loading = response.loading;
        nextState.database.initialized = response.initialized;
        createTableAfmFlds(nextState.database.db).then(error=>{
            let param = false;
            if(!error.error){
                getLocalParam(nextState.database.db).then(res=>{
                    nextState.database.loading.loading = false;
                    if(res.length){
                        nextState = generateUserNextState(nextState,setParameter(res,getUserObj(nextState.user)));
                    }
                    nextState.user.initialized=true;

                    getListOfTableAndCount(nextState.database.db).then(data=>{
                        nextState.database.tables = data;
                        resolve(nextState);
                    })
                }).catch(err=>{
                    nextState.database.loading.loading = false;
                    reject(nextState);
                });
            }else{
                nextState.database.loading.loading = false;
                resolve(nextState);
            }
        });

    })
}
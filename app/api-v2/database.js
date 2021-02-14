import {from, Observable} from "rxjs";
import {CREATE_PARAM_TABLE_STRUCT, createAfmFldsTableQuery, createParamTableQuery, SELECT_PARAM_TABLE} from "./query";
import {WebSQLDatabase} from "expo-sqlite";


export function createTableAfmFldV2(db): Observable<any> {
    const promise: Promise<any> = new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql(createAfmFldsTableQuery, null, () => {
                tx.executeSql(createParamTableQuery);
                resolve({error: false, message: 'finished create field in table'});
            })
        }, (err) => resolve(errorCallback(err)))
    });
    return from(promise);
}

export function getLocalParamV2(db: WebSQLDatabase): Observable<any> {
    const promise: Promise<any> = new Promise((resolve) => {
            db.transaction(tx => {
                tx.executeSql(CREATE_PARAM_TABLE_STRUCT, [],
                    () => {
                        tx.executeSql(
                            SELECT_PARAM_TABLE, [],
                            (sqlTransaction, resultSet) => {
                                let params = [];
                                for (let i = 0; i < resultSet.rows.length; i++) {
                                    let name = resultSet.rows.item(i).param_name;
                                    let value = resultSet.rows.item(i).param_value;
                                    params.push({name, value});
                                }
                                resolve({error: initialError, data: params});
                            })
                    })
            }, (err) => resolve(errorCallback(err)))
        }
    );
    return from(promise);
}

export function errorCallback(err: any): any {
    return {error: {error: true, message: err.message, data: []}};
}

export const initialError = {
    error: false,
    title: '',
    message: ''
}

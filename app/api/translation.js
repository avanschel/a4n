import {GET_TRANSLATION} from "./api";
import {from, Observable, of} from "rxjs";
import {CREATE_TRANSLATION_TABLE, SELECT_TRANSLATION_TABLE} from "../api-v2/query";
import {errorCallback, initialError} from "../api-v2/database";
import {switchMap} from "rxjs/operators";
import {WebSQLDatabase} from "expo-sqlite";

const axios = require("axios");

export function getTranslation(db): Observable<any> {
    return createTranslationTable(db).pipe(
        switchMap((createResponse) => {
            if (createResponse.error) {
                return of(createResponse);
            } else {
                return getTranslationFromTable(db);
            }
        })
    )
}

export function createTranslationTable(db): Observable<any> {
    const promise: Promise<any> = new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql(CREATE_TRANSLATION_TABLE, null, () => {
                resolve({error: false, message: 'finished create translation table'});
            })
        }, (err) => resolve(errorCallback(err)))
    });
    return from(promise);
}

export function getTranslationFromTable(db: WebSQLDatabase): Observable<any> {
    const promise: Promise<any> = new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql(CREATE_TRANSLATION_TABLE, [],
                () => {
                    tx.executeSql(
                        SELECT_TRANSLATION_TABLE, [],
                        (sqlTransaction, resultSet) => {
                            let data = [];
                            for (let i = 0; i < resultSet.rows.length; i++) {
                                data.push(resultSet.rows.item(i));
                            }
                            resolve({error: initialError, data: data});
                        })
                });

        }, (err) => resolve(errorCallback(err)))
    });
    return from(promise);
}

export function retrieveTranslationFromApi(server, db): Observable<any> {
    console.log('server url : ' + server + GET_TRANSLATION);
    const promise: Promise<any> = new Promise((resolve) => {
        axios.get(server + GET_TRANSLATION, {timeout: 35})
            .then(response => {
                clearAndInsertTranslate(db, response.data).subscribe((result) => {
                    resolve(result);
                })
            })
            .catch((error) => {
                resolve(errorCallback(error))
            })
    });
    return from(promise);
}

export function clearAndInsertTranslate(db, translations): Observable<any> {
    console.log("insert data");
    let drop = 'delete from translation;';
    let create = 'insert into translation (lang_id, row_num , screen_id , text_id ,text_title ,text_type)  VALUES(';
    const promise: Promise<any> = new Promise(resolve => {
        db.transaction(tx => {
                tx.executeSql(drop);
                for (let data of translations.a4n_translation_list) {
                    tx.executeSql(create + '"' + data.lang_id + '",' + data.row_num + ',"' + data.screen_id + '","' + data.text_id + '","' + data.text_title + '","' + data.text_type + '");');
                }
                resolve({error: false, message: 'data inserted', data: translations.a4n_translation_list})
            },
            (error) => {
                resolve(errorCallback(error))
            }
        );
    });
    return from(promise);

}

/*
export async function retrieveTranslation(db, server) {
    return new Promise(resolve => {
        createTranslationTable(db).then((cr) => {
            retrieveTranslationFromApi(server).then((result) => {
                clearAndInsertTranslate(db, result).then((insert) => {
                    getFromTranlsationFromDatabase(db).then((translation) => {
                        resolve({success: true, data: translation});
                    }).catch((error) => {
                        resolve({success: false, data: error});
                    })
                }).catch((error) => {
                    resolve({success: false, data: error});
                })
            }).catch((error) => {
                checkDataOrPopulate(db).then((pop) => {
                    resolve({success: true, data: pop});
                }).catch((error) => {
                    resolve({success: false, data: error});
                })
            })
        }).catch((error) => {
            resolve({success: false, data: error});
        })
    });
}

export async function retrieveTranslationFromApi(server) {
    return new Promise((resolve, reject) => {
        axios.get(server + GET_TRANSLATION, {timeout: 35})
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

export async function createTranslationTable(db) {
    let drop = 'drop table if exists translation;';
    let create = 'create table if not exists translation (lang_id text, row_num number, screen_id text, text_id text,text_title text,text_type text)'
    return new Promise(resolve => {
        db.transaction(tx => {
                tx.executeSql(drop, null,
                    (tr, re) => {
                        tx.executeSql(create);
                        resolve({error: false, message: 'finished create translate table'});
                    }
                    , (transact, err) => resolve({error: true, message: err}));
            },
            (err) => {
                resolve({error: true, message: err});
            },
        );
    });
}

export async function clearAndInsertTranslate(db, translations) {

    let drop = 'delete from translation;';
    let create = 'insert into translation (lang_id, row_num , screen_id , text_id ,text_title ,text_type)  VALUES(';
    return new Promise(resolve => {
        db.transaction(tx => {
                tx.executeSql(drop);
                for (let data of translations.a4n_translation_list) {
                    tx.executeSql(create + '"' + data.lang_id + '",' + data.row_num + ',"' + data.screen_id + '","' + data.text_id + '","' + data.text_title + '","' + data.text_type + '");');
                }
                resolve({error: false, message: null})
            },
            (error) => {
                resolve({error: true, message: error});
            }
        );
    });

}

export async function getFromTranlsationFromDatabase(db) {
    return new Promise((resolve) => {
            db.transaction(tx => {
                tx.executeSql(
                    'select lang_id, row_num , screen_id , text_id ,text_title ,text_type from translation', [],
                    (_, {rows: {_array}}) => {
                        resolve(_array);
                    }
                );
            }, (err) => {
            }, (tx, result) => {
            });
        }
    );
}

export async function checkDataOrPopulate(db) {
    return new Promise((resolve, reject) => {
        getFromTranlsationFromDatabase(db).then((translation) => {
            if (translation.length > 0) {
                resolve(translation)
            } else {
                resolve(getDefaultTranslation());
            }
        }).catch((error) => {
            reject(error);
        });
    });

}

export function getDefaultTranslation() {
    return defaultTranslation;
}
*/
/**
 *  Object {
      "lang_id": "fr",
      "row_num": 12,
      "screen_id": "login-screen",
      "text_id": "username",
      "text_title": "Entrez votre identifiant / champ requis",
      "text_type": "placeholder",
    },

 */

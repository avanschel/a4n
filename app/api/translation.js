import {GET_TRANSLATION} from "./api";

export async function retrieveTranslation(db, server) {
    console.log('je retrieve les langues');
    return new Promise(resolve => {
        createTranslationTable(db).then((cr) => {
            retrieveTranslationFromApi(server).then((result) => {
                console.log("result of api", result);
                clearAndInsertTranslate(db, result).then((insert) => {
                    getFromTranlsationFromDatabase(db).then((translation) => {
                        console.log('mes transaltions', translation);
                        resolve({success: true, data: null});
                    }).catch((error) => {
                        resolve({success: false, data: error});
                    })
                }).catch((error) => {
                    resolve({success: false, data: error});
                })
            }).catch((error) => {
                resolve({success: false, data: error});
            })
        }).catch((error) => {
            resolve({success: false, data: error});
        })
    });
}

export async function retrieveTranslationFromApi(server) {
    return new Promise((resolve, reject) => {
        console.log('my request', server + GET_TRANSLATION);
        try {
            fetch(server + GET_TRANSLATION).then(res => {
                if (!res.ok) {
                    reject(res.statusText);
                }
                let resJson = res.json();
                console.log('mon resJson', resJson);
                resolve(resJson);
            }).catch(err => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
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

/* Initialization of the data ======================
1.Open the data.
2.Create the params table if not exist.
===================================================== */
import * as SQLite from "expo-sqlite";
import {SET_LOCAL_PARAM} from "../store/actions/actions";
import {SURV_PREFIX} from "../../constante";

export async function getListOfTableAndCount(db) {
    return new Promise(resolve => {

        getListOfTable(db).then(list => {

            getNbElement(db, list).then(res => {
                resolve(res);
            });
        })
    });
}

export async function getNbElement(db, list) {
    let data = [];
    for (let table of list) {
        await new Promise(resolve => {
            let query = 'select "' + table.table_name + '" table_name,"' + table.title + '" title,"' + table.nbblocrecord + '" nbblocrecord,"' + table.role + '" role,count(*)nb_element  from ' + table.table_name;
            query += (table.table_name !== 'afm_flds') ? ' UNION ALL select "' + table.table_name + SURV_PREFIX + '" table_name,"' + table.title + '" title,"' + table.nbblocrecord + '" nbblocrecord,"' + table.role + '" role,count(*)nb_element from ' + table.table_name + SURV_PREFIX : '';
            db.transaction(tx => {
                tx.executeSql(query, [],
                    (_, {rows: {_array}}) => {
                        for (let e of _array) {
                            data.push(e);
                        }
                        resolve(_array);
                    }
                );
            }, (err) => {
            }, (tx, result) => {
            });
        });
    }
    return data;
}

export async function getListOfTable(db) {
    return new Promise((resolve) => {
            db.transaction(tx => {
                tx.executeSql(
                    'select table_name, title, role,nbblocrecord,nbrecord  from afm_flds  group by table_name,title,role', [],
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

export function openLocalDatabase(dbName) {
    let response = {};
    try {
        const db = SQLite.openDatabase(dbName);
        response = {error: {error: false}, db: db, initialized: true, loading: {loading: true, message: null}}
        /*db.transaction(tx=> {
                 let delQuery = 'delete  from param_table ';
                 tx.executeSql(delQuery);

         });*/
    } catch (ex) {
        response = {error: {error: true, message: ex}, db: null, initialized: false, loading: {loading: false}}
    }
    return response;
}

export function createTableAfmFlds(db) {
    let dropQuery = 'drop table if exists afm_flds;';
    let createAfmFldsQuery = 'create table if not exists afm_flds (nbblocrecord text,nbrecord text, table_name text, title text,  field_name text, primary_key text, data_type text, dflt_val text, enum_list text, ml_heading text, ref_table text, dep_cols text, role text, restriction text, required text, readonly text, scantofld text, display_order text,validate_data text)';
    let createParamTableQuery = 'create table if not exists param_table (param_name text, param_value text, description text)'
    return new Promise(resolve => {
        db.transaction(tx => {
                tx.executeSql(createAfmFldsQuery, null,
                    (tr, re) => {
                        tx.executeSql(createParamTableQuery);
                        resolve({error: false, message: 'finished create field in table'});
                    }
                    , (transact, err) => resolve({error: true, message: err}));
            },
            (err) => {
                resolve({error: true, message: err});
            },
        );
    });
}

export async function eraseTableAfmFlds(db, tbl = false) {
    db.transaction(tx => {
            let query = 'delete from afm_flds ';
            if (tbl) {
                query = ' where table_name="' + tbl + '"';
            }
            tx.executeSql(query);
            return {error: false, message: ''};
        }, (err) => {
            return {error: true, message: err}
        },
    );
    return {error: false, message: ''};
}

export function getLocalParam(db) {
    let createParamTableQuery = 'create table if not exists param_table (param_name text, param_value text, description text)'

    return new Promise((resolve) => {
            db.transaction(tx => {

                tx.executeSql(createParamTableQuery, null,
                    (tr, re) => {
                        tx.executeSql(
                            'select * from param_table', [],
                            (_, {rows: {_array}}) => {
                                let params = [];
                                for (let i = 0; i < _array.length; i++) {
                                    let valItem = _array[i].bl_id;
                                    let name = _array[i].param_name;
                                    let value = _array[i].param_value;
                                    let newBl = {"BL_ID": valItem};
                                    params.push({name, value});
                                }
                                resolve(params);
                            }, (err) => {
                            }, (tx, result) => {
                            }
                        )

                    }
                    , (transact, err) => resolve({error: true, message: err}));

            }, (err) => resolve({error: true, message: err}), (tx, result) => {
            });
        }
    );
}

export function setLocalParams(db, params) {
    let delQuery;
    let insertQuery;
    db.transaction(tx => {
        for (let param in params) {
            delQuery = 'delete  from param_table where param_name ="' + params[param].name + '"';
            insertQuery = "insert into param_table (param_value, param_name) values ('" + params[param].value + "','" + params[param].name + "');";
            tx.executeSql(delQuery);
            tx.executeSql(insertQuery);
        }
    });
}

export async function insertAssetAfmFlds(db, tbl_name, fields, values) {
    return new Promise(resolve => {
        db.transaction(tx => {
                let insertQuery = 'insert into afm_flds (' + fields.join(',') + ') VALUES("' + values.join('","') + '");';
                tx.executeSql(insertQuery, null, (
                    transact, resultset) => resolve(resultset.insertId)
                    , (transact, err) => {
                    });
            },
            (error) => {
                resolve({error: true, message: error});
            }
        );
    });
}

export async function insertDefFieldAfmFlds(db, tbl_name, defFields) {
    return new Promise(resolve => {
        db.transaction(tx => {
                let baseQuery = 'insert into afm_flds (table_name,field_name,primary_key) VALUES(';
                let query;
                for (let defField of defFields.fields) {
                    tx.executeSql(baseQuery + '"' + tbl_name + '","' + defField.field_name + '","' + defField.primary_key + '");');
                }
                resolve({error: false, message: null})
            },
            (error) => {
                resolve({error: true, message: error});
            }
        );
    });
}

export async function getNbElementForTable(db) {
    return new Promise((resolve) => {
            db.transaction(tx => {
                tx.executeSql(
                    'select nbblocrecord,table_name from afm_flds where table_name <> "afm_flds" group by table_name,nbblocrecord', [],
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

export async function insertDataToTable(db, tableName, fields, values) {
    return new Promise(resolve => {
        let val = [];
        if (values.length) {
            for (let value of values[0]) {
                val.push('?');
            }
            let query = "insert into " + tableName + " (" + fields.join(",") + ") VALUES (" + val.join(",") + ")";
            let i = 0;
            db.transaction(tx => {
                    values.map((value => {
                        tx.executeSql(query, value, (
                            transact, resultset) => {
                            i++;
                            resolve(true);
                        }, (transact, err) => {
                            resolve(false);
                        });
                    }))
                    /* tx.executeSql(query,values,(
                         transact,resultset) => resolve(resultset)
                         ,(transact,err) => console.log('We have encounter an Error', err));*/
                },
                (error) => {
                    resolve({error: true, message: error});
                }
            );

        } else {
            resolve('no data to insert');
        }
    });
}

export async function countElement(db, tableName) {
    return new Promise((resolve) => {
            db.transaction(tx => {
                tx.executeSql(
                    'select count(*) items from ' + tableName, [],
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

export async function eraseTable(db, tableName) {
    return new Promise(resolve => {
        let query = "delete from " + tableName + ";";
        db.transaction(tx => {
                tx.executeSql(query, null, (
                    transact, resultset) => resolve(query)
                    , (transact, err) => {
                        resolve({error: true, message: error});
                    });
            },
            (error) => {
                resolve({error: true, message: error});
            }
        );
    });
}

export async function createTable(db, tblName) {
    return new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql('drop table if exists ' + tblName, [],
                (transact, result) => {
                    tx.executeSql(
                        `select *
                         from afm_flds
                         where table_name like ?
                         order by primary_key asc`, [tblName.replace(SURV_PREFIX, '')],
                        (_, {rows: {_array}}) => {
                            let columnString = "";
                            let primaryString = ' PRIMARY KEY ( ';
                            _array.map((item, ind) => {
                                if (item.primary_key.length > 0) {
                                    primaryString += " " + item.field_name + ",";
                                }
                                columnString += " " + item.field_name + ",";
                            });
                            primaryString = primaryString.slice(0, -1) + ")";
                            let scanInfo = '';
                            if (tblName.indexOf('surv') !== -1) {
                                scanInfo = ' date_updated text, date_scan text, time_scan text, scanned_by text  ,';
                            }
                            let query = "create table " + tblName + " ( " + scanInfo + columnString + " " + primaryString + ")";
                            tx.executeSql(query, [],
                                (tr, res) => {
                                    if (tblName.startsWith('ta')) {
                                        tx.executeSql(
                                            'create unique index  if not exists pk_ta on ' + tblName + ' (barcode)'
                                        );
                                    }
                                    _array.map((item, ind) => {
                                        if (item.primary_key.length > 0 || item.scantofld > 0) {
                                            tx.executeSql("create index idx_" + tblName + "_" + item.field_name + " on " + tblName + "(" + item.field_name + ")", [],
                                                (f, c) => {
                                                    resolve({error: false, message: ''});
                                                }, (f, er) => {
                                                    resolve({error: true, message: er});
                                                });
                                        }
                                    })
                                }, (tr, err) => {
                                    resolve({error: true, message: err});
                                });
                        }
                    );
                },
                (transact, error) => {
                    resolve({error: true, message: error});
                });

        }, (err) => {
            resolve({error: true, message: err});
        }, (tx, result) => {
            resolve({error: false, message: ''});
        });
    })
}

export async function getTableField(db, tblName) {
    return new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql(
                'select *  from afm_flds where table_name ="' + tblName + '" order by primary_key', [],
                (_, {rows: {_array}}) => {
                    resolve(_array);
                }
            );
        }, (err) => {
        }, (tx, result) => {
        });
    });
}

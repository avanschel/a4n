/* CreateAllTable =============================
 The method retrieve all table_name in afm_flds
 except the afm_flds table.
 Then call createTable method for creating the
 table (see the next method for detail).
============================================= */
import {afmFldsFieldDefs} from "./tableDef";
import {GET_ASSET_FROM_SERVER} from "./api";
import {PROGRESS_RUNNING, PROGRESS_UPDATE} from "../store/actions/actions";
import {
    countElement,
    createTable,
    createTableAfmFlds,
    eraseTable,
    eraseTableAfmFlds, getListOfTableAndCount,
    getNbElementForTable,
    insertAssetAfmFlds,
    insertDataToTable,
    insertDefFieldAfmFlds
} from "./database";
import {getAssetsFromApiAsync} from "./assets";
import {SURV_PREFIX} from "../../constante";
import {retrieveListOfTable} from "./data";


/* Import part ==========================================================================
        1. Create afm_flds table (done)
        2. Erase data from afm_flds (the first is for create table if not exist)
        3. Insert afm_flds fields [CAN OPTIMIZE IF WE NOT REMOVE THIS FIELD IN POINT 2)
        4. ----- NEW VERSION
        4. Retrieve all table we need
        5. Create these fields in afm_flds
        6. Create all table
        7. Fill Table with data
        8. is Finished :)
    ======================================================================================= */

export async function importData(db, server, dispatch, state) {
    state = {
        loading: true,
        button: false,
        error: true,
        errorMessage: 'Error occured while creating structure.',
        cat: 'IMPORT IN PROGRESS',
        text: 'Init storage ',
        percent: 5
    };
    dispatch({type: PROGRESS_RUNNING, state: state});
    let importData = new Promise(resolve => {
        // Step 1
        createAfmFldsTable(db).then(res => {
            if (res) {
                // Step 2 and 3
                state = {
                    loading: true,
                    button: false,
                    error: false,
                    errorMessage: null,
                    cat: 'IMPORT IN PROGRESS',
                    text: 'Init storage ',
                    percent: 5
                };
                dispatch({type: PROGRESS_UPDATE, state: state});
                insertAfmFieldInAfmTbl(db, false).then(iAFA => {
                    if (res.error) {
                        state = {
                            loading: true,
                            button: false,
                            error: true,
                            errorMessage: 'Error occured while creating structure.',
                            cat: 'IMPORT IN PROGRESS',
                            text: 'Init storage ',
                            percent: 5
                        };
                        dispatch({type: PROGRESS_UPDATE, state: state});
                    } else {
                        state = {
                            loading: true,
                            button: false,
                            error: false,
                            errorMessage: null,
                            cat: 'IMPORT IN PROGRESS',
                            text: 'Retrieve assets definitions ',
                            percent: 10
                        };
                        dispatch({type: PROGRESS_UPDATE, state: state});
                        // Step 4 and 5
                        retrieveAllTableDefinitions(db, dispatch, server, state).then(fieldDefinitions => {
                            state = {
                                loading: true,
                                button: false,
                                error: false,
                                errorMessage: null,
                                cat: 'IMPORT IN PROGRESS',
                                text: 'Creating table in storage ',
                                percent: 50
                            };
                            dispatch({type: PROGRESS_UPDATE, state: state});
                            // Step 6
                            createAllTables(db, dispatch, state).then(tableDefs => {
                                // Step 7
                                state = {
                                    loading: true,
                                    button: false,
                                    error: false,
                                    errorMessage: null,
                                    cat: 'IMPORT IN PROGRESS',
                                    text: 'Retrieving data from server ',
                                    percent: 70
                                };
                                dispatch({type: PROGRESS_UPDATE, state: state});
                                //FINAL STEP HERE
                                getListOfTableAndCount(db).then(tablesCount => {
                                    retrieveAndFillTable(db, dispatch, server, state, fieldDefinitions, tablesCount).then(final => {
                                        resolve(final);
                                    })
                                })
                            }).catch(err => {
                            });
                        }).catch(err => {
                        });
                        //resolve(true);
                    }
                });
            } else {
                state = {
                    loading: true,
                    button: false,
                    error: true,
                    errorMessage: 'Error occured while creating structure.',
                    cat: 'IMPORT IN PROGRESS',
                    text: 'Init storage ',
                    percent: 5
                };
                dispatch({type: PROGRESS_UPDATE, state: state});
            }
        });
    });
    return importData.then(res => {
        state = {
            loading: true,
            button: true,
            error: false,
            errorMessage: null,
            cat: 'IMPORT IN PROGRESS',
            text: 'import finished successfully',
            percent: 100
        };
        dispatch({type: PROGRESS_UPDATE, state: state});
        return {type: PROGRESS_UPDATE, state: state};
    }).catch(error => {
        state = {
            loading: true,
            button: true,
            error: true,
            errorMessage: error,
            cat: 'IMPORT IN PROGRESS',
            text: 'import finished successfully',
            percent: 100
        };
        dispatch({type: PROGRESS_UPDATE, state: state});
        return {type: PROGRESS_UPDATE, data: {error: false}};
    });

}

export async function createAfmFldsTable(db) {
    return new Promise((resolve) => {
        createTableAfmFlds(db).then(res => {
            resolve(true);
        });
    }).catch(err => {
        return err;
    });
}

export async function insertAfmFieldInAfmTbl(db, tbl) {
    return new Promise((resolve) => {
        eraseTableAfmFlds(db, tbl).then(res => {
            if (res.error) {
                resolve(res);
            } else {
                insertDefFieldAfmFlds(db, 'afm_flds', afmFldsFieldDefs).then(res => {
                    resolve(res);
                }).catch(err => {
                    resolve(err);
                });
            }
        }).catch(err => {
            resolve(err);
        });
    })
}

export async function retrieveAllTableDefinitions(db, dispatch, server, state) {
    return new Promise(resolve => {
        getAssetsFromApiAsync(server, 'afm_flds', 0).then(res => {
            console.log('----------------------------------------');
            console.log(res);
            console.log('----------------------------------------');
            let tableDefsAndFields = {};
            for (let item of res.afm_flds_list) {
                let key = item.table_name;
                if (!(key in tableDefsAndFields)) {
                    tableDefsAndFields[key] = [];
                    tableDefsAndFields[key].push(item.field_name);
                } else {
                    tableDefsAndFields[key].push(item.field_name);
                }
            }
            insertAfmFldsAssetDef(db, dispatch, state, res.afm_flds_list).then(result => {
                resolve(tableDefsAndFields);
            })
        })
    })
}

export async function insertAfmFldsAssetDef(db, dispatch, state, data) {
    let table;
    let percent = 10;
    let fields = ["nbblocrecord", "table_name", "title", "field_name",
        "primary_key", "data_type", "dflt_val", "enum_list",
        "ml_heading", "ref_table", "dep_cols", "role",
        "restriction", "required", "readonly",
        "scantofld", "display_order"];
    let valuesBRUT;
    let values = [];
    let index = -1;
    for (let def of data) {
        values = [];
        percent += Math.floor(40 / data.length);
        valuesBRUT = Object.values(def);
        table = def.table_name;
        for (let i = 0; i < fields.length; i++) {
            let val = (def[fields[i]] === undefined) ? '' : def[fields[i]];
            values.push(val);
        }
        await new Promise(resolve => {
            insertAssetAfmFlds(db, def.table_name, fields, values).then(res => {
                resolve(true);
            })
        });
        state = {
            loading: true,
            button: false,
            error: false,
            errorMessage: null,
            cat: 'IMPORT IN PROGRESS',
            text: 'Inserting def ' + def.table_name + '.' + def.field_name + ' ',
            percent: percent
        };
        dispatch({type: PROGRESS_UPDATE, state: state});
    }
    return state;
}

export async function createAllTables(db, dispatch, state) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                    `select distinct table_name
                     from afm_flds
                     where table_name <> "afm_flds"`, [],
                (_, {rows: {_array}}) => {
                    launchCreateTable(db, dispatch, state, _array).then(res => {
                        resolve(_array);
                    })
                }
            )
        }, (err) => {
            reject(err);
        });
    });
}

export async function launchCreateTable(db, dispatch, state, data) {
    let percent = state.percent;
    for (let i = 0; i < data.length; i++) {
        percent += Math.round(20 / data.length);
        await new Promise(resolve => {
            state = {
                loading: true,
                button: false,
                error: false,
                errorMessage: null,
                cat: 'IMPORT IN PROGRESS',
                text: 'Create table ' + data[i].table_name + ' ',
                percent: percent
            };
            dispatch({type: PROGRESS_UPDATE, state: state});
            createTable(db, data[i].table_name).then(result => {
                createTable(db, data[i].table_name + SURV_PREFIX).then(rs => {
                    resolve('finished table ' + data[i].table_name)
                });
            });
        });
    }
    return true;
}

export async function retrieveAndFillTable(db, dispatch, server, state, fieldDefinitions, tablesCount) {
    return new Promise(resolve => {
        getNbElementForTable(db).then(nbBloc => {
            launchEraseTable(db, server, nbBloc).then(res => {
                launchRetrieveAndFill(db, server, dispatch, nbBloc, state, fieldDefinitions, tablesCount).then(res => {
                    resolve(res);
                })
            })

        })

    })
}

export async function launchEraseTable(db, server, nbBloc) {
    for (let bloc of nbBloc) {
        await new Promise(resolve => {
            eraseTable(db, bloc.table_name).then(res => {
                eraseTable(db, bloc.table_name + SURV_PREFIX).then(res => {
                    resolve(true);
                })
            })
        })
    }
    return true;
}

export async function launchRetrieveAndFill(db, server, dispatch, nbBloc, state, fieldDefinitions, tablesCount) {
    /* For graphical */
    let elements = 0;
    for (let i = 0; i < tablesCount.length; i++) {
        if (isNaN(tablesCount[i].nbblocrecord) || tablesCount[i].table_name.indexOf(SURV_PREFIX) > -1) {

        } else {
            elements += parseInt(tablesCount[i].nbblocrecord);
        }

    }
    let percentStep = 30 / elements;

    for (let bloc of nbBloc) {
        for (let i = 0; i < bloc.nbblocrecord; i++) {
            await new Promise(resolve => {
                getDataFromServer(server, bloc.table_name, i).then(data => {
                    launchInsertDataToTable(db, bloc.table_name, data, dispatch, percentStep, i, bloc.nbblocrecord, state, fieldDefinitions).then(result => {
                        state = result;
                        resolve(state);
                    });
                }).catch(error => {
                });
            });
        }
    }
    return true;
}

/* getAssetsFromApiAsync ============================
============================================= */
export async function getDataFromServer(server, tbl, blocNb) {
    return new Promise((resolve, reject) => {
        try {
            fetch(server + GET_ASSET_FROM_SERVER + tbl.toUpperCase() + "&paramBloc=" + blocNb).then(res => {
                if (!res.ok) {
                    reject(res.statusText);
                }
                let resJson = res.json();
                resJson.tbl = tbl;
                resolve(resJson);
            }).catch(err => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    })
}

export async function launchInsertDataToTable(db, tableName, dataArray, dispatch, percentStep, current, nbBLoc, state, fieldDefinitions) {
    let percent = state.percent;
    let text;
    let valuesArray = [];
    percent = Math.round((percent + percentStep) * 100) / 100;
    for (let data of dataArray[tableName + '_list']) {
        text = 'Insert element to ' + tableName + ' page ' + (current + 1) + '/' + nbBLoc + ' ... ';
        // Prepare data, because we receive some field that not used into the app.
        let values = [];
        for (let i = 0; i < fieldDefinitions[tableName].length; i++) {
            let val = (data[fieldDefinitions[tableName][i]] === undefined) ? '' : data[fieldDefinitions[tableName][i]];
            val = (val instanceof Date) ? val.toISOString() : val;
            values.push(val);
        }
        valuesArray.push(values);
        /*await new Promise(resolve=>{

            insertDataToTable(db,tableName,fieldDefinitions[tableName],values).then(result=>{

                resolve(result);
            });
            state = {loading:true,button:false,error:false,errorMessage:null,cat:'IMPORT IN PROGRESS',text:text,percent:percent};
            dispatch({type:PROGRESS_UPDATE,state:state});
        });*/
    }
    await new Promise(resolve => {
        insertDataToTable(db, tableName, fieldDefinitions[tableName], valuesArray).then(result => {
            state = {
                loading: true,
                button: false,
                error: false,
                errorMessage: null,
                cat: 'IMPORT IN PROGRESS',
                text: text,
                percent: percent
            };
            dispatch({type: PROGRESS_UPDATE, state: state});
            resolve(true);
        });
    });
    return state;
}

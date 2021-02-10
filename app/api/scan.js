import {countElement, getListOfTable, getListOfTableAndCount, getTableField, insertDataToTable} from "./database";
import {
    SET_TABLE_LIST,
    setNewCodeBar,
    setNewContainer,
    setScanDefFields,
    setScanState,
    setSurvey
} from "../store/actions/actions";
import {asyncRetrieveAssetsByFilter, asyncRetrieveAssetsById} from "./assets";
import {SCAN_FOUND_AND_IDENTICAL, SCAN_FOUND_ERROR, SCAN_FOUND_WITH_DIFF, SCAN_NOT_FOUND} from "../../constante";

import moment from "moment";

export async function retrieveDataForCodeBar(db, dispatch, state, codeBar, mode) {
    let data;
    let nextState;
    let status = SCAN_NOT_FOUND;
    let fieldNameToCheck = (mode === 'eq') ? 'eq_id' : 'barcode';
    return new Promise(resolve => {
        if (codeBar === null) {
            nextState = {
                loading: true,
                error: false,
                text: '',
                container: state.container,
                code: null,
                founded: false,
                status: false,
                data: {},
                defFields: state.defFields,
                survey: {},
                canScan: true
            };
            resolve(setNewCodeBar(nextState));
        } else {
            asyncRetrieveAssetsById(db, mode, fieldNameToCheck, codeBar, null).then(res => {
                if (res.length) {
                    data = res[0];
                    status = (state.container && state.container.bl_id === data.bl_id && state.container.fl_id === data.fl_id && state.container.rm_id === data.rm_id) ? SCAN_FOUND_AND_IDENTICAL : SCAN_FOUND_WITH_DIFF;
                    nextState = {
                        ...state,
                        loading: false,
                        error: false,
                        text: '',
                        code: codeBar,
                        founded: true,
                        status: status,
                        data: data,
                        survey: data,
                        original: {bl_id: data.bl_id, fl_id: data.fl_id, rm_id: data.rm_id}
                    }
                } else {
                    //On genere un objet vide
                    let surv = {};
                    state.defFields.map((defField) => {
                        surv[defField.field_name] = (defField.field_name === fieldNameToCheck) ? codeBar : (defField.field_name === 'bl_id') ? state.container.bl_id : (defField.field_name === 'fl_id') ? state.container.fl_id : (defField.field_name === 'rm_id') ? state.container.rm_id : '';
                    });
                    nextState = {
                        ...state,
                        loading: false,
                        error: false,
                        text: '',
                        code: codeBar,
                        founded: false,
                        status: status,
                        data: {},
                        survey: surv
                    };
                }
                resolve(setNewCodeBar(nextState));
            }, (err) => {
                nextState = {
                    ...state,
                    loading: false,
                    error: err.error,
                    text: err.msg,
                    code: codeBar,
                    founded: false,
                    status: SCAN_FOUND_ERROR,
                    data: {}
                };
                resolve(setNewCodeBar(nextState));
            }).catch((err) => {
                nextState = {
                    ...state,
                    loading: false,
                    error: err,
                    text: err,
                    code: codeBar,
                    founded: false,
                    status: SCAN_FOUND_ERROR,
                    data: {}
                };
                resolve(setNewCodeBar(nextState));
            });

        }
    });
}

export async function editContainer(dispatch, state, table, value, full) {
    return new Promise(resolve => {
        let container;
        if (full) {
            container = value;
        } else {
            switch (table) {
                case 'bl':
                    container = {...state.container, bl_id: value};
                    break;
                case 'fl':
                    container = {...state.container, fl_id: value};
                    break;
                case 'rm':
                    container = {...state.container, rm_id: value};
                    break;
            }
        }
        let nextState = {...state, container: container};
        resolve(setNewContainer(nextState));

    });
}

export async function getTableDefTa(dispatch, state, db) {
    return getTableDef(dispatch, state, db, 'ta');
}

export async function getTableDef(dispatch, state, db, table) {
    return new Promise(resolve => {
        getTableField(db, table).then(res => {
            resolve(setScanDefFields({...state, defFields: res}));
        })
    })
}

export async function onChangeSurvey(state, survey) {
    return new Promise(resolve => {
        let nextState = {...state, survey: survey};
        resolve(setSurvey(nextState));
    })
}

export async function onSetSCanState(state) {
    return new Promise(resolve => {

        resolve(setScanState(state));
    })
}

export async function saveSurveyAfterScanning(db, dispatch, dbState, state, user, mode) {
    let fieldNameToCheck = (mode === 'eq') ? 'eq_std' : 'fn_std';
    return new Promise(resolve => {
        let requiredField = state.defFields.filter((item) => {
            return item.required === 'Y'
        });
        let nextState;
        let errorField = [];
        let survey;
        if (state.code === null) {
        } else {
            requiredField.map((item) => {
                if (state.survey[item.field_name].length === 0) {
                    errorField.push(item.ml_heading.replace(/\n|\r|(\n\r)/g, ' ').toUpperCase());
                }

            });
            if (errorField.length) {
                nextState = {
                    ...state,
                    loading: false,
                    error: true,
                    text: 'les champs suivants sont requis :' + errorField.join(',')
                };
                resolve(setNewCodeBar(nextState));
            } else {
                let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                survey = {...state.survey, date_updated: '', date_scan: date, time_scan: date, scanned_by: user};
                let index = -1;
                let keys = Object.keys(survey);
                let data = Object.values(survey);
                if (mode === 'ta') {
                    index = keys.indexOf('eq_std');
                } else if (mode === 'eq') {
                    index = keys.indexOf('fn_std');
                }

                if (index > -1) {
                    keys.splice(index, 1);
                    data.splice(index, 1);
                }
                insertDataToTable(db, mode + '_surv', keys, [data]).then(res => {
                    getListOfTableAndCount(db).then(res => {
                        dispatch({type: SET_TABLE_LIST, tables: res});
                    }).catch((err) => {
                        dispatch({type: SET_TABLE_LIST, tables: []});
                    });
                    nextState = {
                        loading: true,
                        error: false,
                        text: '',
                        container: state.container,
                        code: null,
                        founded: false,
                        status: false,
                        data: {},
                        defFields: state.defFields,
                        survey: {},
                        canScan: true
                    };
                    resolve(setNewCodeBar(nextState));
                })
            }
        }

    })
}

export async function checkBlFlRm(db, table, data) {

    return new Promise(resolve => {
        let retVal = {message: '', filter: null, good: true};
        switch (table) {
            case 'bl':
                retVal.message = 'Il n\'existe aucun bâtiment avec le code :' + data.bl_id;
                retVal.filter = (data.bl_id.length > 0) ? "bl_id ='" + data.bl_id + "'" : null;
                break;
            case 'fl':
                if (data.bl_id.length > 0 && data.fl_id.length > 0) {

                    retVal.message = 'L\'étage "' + data.fl_id + '" n\'existe pas dans le bâtiment ' + data.bl_id;
                    retVal.filter = "bl_id ='" + data.bl_id + "' AND fl_id='" + data.fl_id + "' ";
                } else {
                    retVal.filter = null;
                }
                break;
            case 'rm':
                if (data.rm_id.length > 0 && data.bl_id.length > 0 && data.rm_id.length > 0) {
                    retVal.message = 'Le local  "' + data.rm_id + '" n\'existe pas dans le bâtiment ' + data.bl_id + ' à l\'étage ' + data.fl_id;
                    retVal.filter = "bl_id ='" + data.bl_id + "' AND fl_id='" + data.fl_id + "' AND rm_id='" + data.rm_id + "' ";
                } else {
                    retVal.filter = null;
                    retVal.good = true;
                }
                break;
        }
        if (retVal.filter !== null) {
            asyncRetrieveAssetsByFilter(db, table, retVal.filter).then(retour => {
                retVal.good = (retour.length > 0);
                resolve(retVal);
            });
        }
    });
}

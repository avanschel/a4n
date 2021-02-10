import {asyncRetrieveAssets} from "./assets";
import {PROGRESS_RUNNING, PROGRESS_UPDATE} from "../store/actions/actions";
import {eraseTable, getNbElementForTable} from "./database";
import {SURV_PREFIX} from "../../constante";
import {SEND_DATA_TO_SERVER} from "./api";
import {translate} from "../store/reducers/translation";

export async function exportData(db, server, dispatch, state, translation) {
    const translateTxt = {
        exportFinished: translate('import-screen', 'export-finished', translation),
        exportFinishedText: translate('import-screen', 'export-finished-txt', translation),
        exportInProgress: translate('import-screen', 'export-in-progress', translation),
        exportRetrieveTableDef: translate('import-screen', 'export-retrieve-table-def', translation),
        exportStartLaunch: translate('import-screen', 'export-start-launch', translation),
        exportLaunchDataFor: translate('import-screen', 'export-launch-data-for', translation),
        exportSendDataFor: translate('import-screen', 'export-data-send', translation)
    }
    state = {
        loading: true,
        button: false,
        error: false,
        errorMessage: null,
        cat: translateTxt.exportFinished,
        text: translateTxt.exportFinishedText,
        percent: 100
    };
    dispatch({type: PROGRESS_RUNNING, state: state});

    return new Promise(resolve => {
        state = {
            loading: true,
            button: false,
            error: false,
            errorMessage: null,
            cat: translateTxt.exportInProgress,
            text: translateTxt.exportRetrieveTableDef,
            percent: 10
        };
        dispatch({type: PROGRESS_UPDATE, state: state});
        retrieveAndDataTable(db, state, dispatch, translateTxt).then(data => {
            state = {
                loading: true,
                button: false,
                error: false,
                errorMessage: null,
                cat: translateTxt.exportInProgress,
                text: translateTxt.exportStartLaunch,
                percent: state.percent
            };
            dispatch({type: PROGRESS_UPDATE, state: state});
            // db, server, dispatch, state, tables, data, translateTxt
            launchSendDataToServer(db, server, dispatch, state, data, null, translateTxt).then(
                res => {
                    state = {
                        loading: true,
                        button: true,
                        error: false,
                        errorMessage: null,
                        cat: translateTxt.exportFinished,
                        text: translateTxt.exportFinishedText,
                        percent: 100
                    };
                    dispatch({type: PROGRESS_UPDATE, state: state});
                }
            ).catch((err) => {
                console.log('mon err', err);
            })
        })
    });
}

export async function retrieveAndDataTable(db, state, dispatch, translateTxt) {
    return new Promise(resolve => {
        getNbElementForTable(db).then(nbBloc => {
            retrieveDataFromLocalTable(db, nbBloc, state, dispatch, translateTxt).then(res => {
                resolve(res);
            });
        })

    })
}

export async function retrieveDataFromLocalTable(db, tables, state, dispatch, translateTxt) {
    let data = [];
    let percent = state.percent;
    let percentStep = 40 / tables.length;
    for (let table of tables) {
        percent += percentStep;
        state = {
            loading: true,
            button: false,
            error: false,
            errorMessage: null,
            cat: translateTxt.exportInProgress,
            text: translateTxt.exportLaunchDataFor + ' ' + table.table_name + SURV_PREFIX,
            percent: percent
        };
        dispatch({type: PROGRESS_UPDATE, state: state});
        await asyncRetrieveAssets(db, table.table_name + SURV_PREFIX).then(res => {
            data.push({table: table.table_name + SURV_PREFIX, data: res});
            return true;
        })
    }
    return data;
}

export async function launchSendDataToServer(db, server, dispatch, state, tables, data, translateTxt) {
    let percent = state.percent;
    let percentStep = 40 / tables.length;
    for (let table of tables) {
        percent += percentStep;
        if (table.data.length > 0) {
            state = {
                loading: true,
                button: false,
                error: false,
                errorMessage: null,
                cat: translateTxt.exportInProgress,
                text: translateTxt.exportSendDataFor + ' ' + table.table,
                percent: percent
            };
            dispatch({type: PROGRESS_UPDATE, state: state});
            await sendDataToServer(db, server, dispatch, state, table.table, table.data).then(res => {
                return true;
            })
        }
    }
    return true;
}

export async function sendDataToServer(db, server, dispatch, state, tableName, data) {
    return new Promise(resolve => {
        fetch(server + SEND_DATA_TO_SERVER + tableName, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=iso-8859-1',
            },
            body: JSON.stringify({data: data}),
        }).then(res => {
            eraseTable(db, tableName).then(res => {
                resolve(true);
            })
        }).catch((error) => {
                resolve(false);
            }
        );
    });

}

import {onLoginError, onLoginPending, onLoginSuccess} from '../store/actions/actions';
import {LOGIN_URL} from "./api";

export function offlineLogin(dispatch, server, username, password) {
    let offlineLogin = new Promise(resolve => {
        dispatch(onLoginSuccess({auth: "OK"}));
    });
    offlineLogin.then(res => {
        console.log(res);
    })
}

export async function getOfflineData(db, username, password) {
    return new Promise(resolve => {
        let createParamTableQuery = 'create table if not exists login (username text, password text)';
        db.transaction(tx => {
            tx.executeSql(createParamTableQuery, null,
                (tr, re) => {
                    let query = 'select *  from login where username ="' + username + '" AND password="' + password + '"';
                    tx.executeSql(
                        query, [],
                        (_, {rows: {_array}}) => {
                            let params = [];
                            for (let i = 0; i < _array.length; i++) {
                                let valItem = _array[i].bl_id;
                                let user = _array[i].username;
                                let pwd = _array[i].password;
                                params.push({user: user, password: pwd});
                            }
                            resolve(params);
                        }, (err) => {
                            console.log('error', err)
                        })

                }
                , (transact, err) => {
                    console.log(err);
                    resolve({error: true, message: err})
                });

        }, (err) => resolve({error: true, message: err}), (tx, result) => {
        });
    });
}

function setOfflineData(db, data) {
    let createParamTableQuery = 'create table if not exists login (username text, password text)';
    return new Promise(resolve => {
        db.transaction(tx => {
                tx.executeSql(createParamTableQuery, null,
                    (tr, re) => {
                        let delQuery = 'delete  from login where username ="' + data.user.toUpperCase() + '"';
                        tx.executeSql(delQuery, null,
                            (tr, re) => {
                                let insertQuery = "insert into login (username, password) values ('" + data.user.toUpperCase() + "','" + data.pwd.toUpperCase() + "');";
                                tx.executeSql(insertQuery);
                                resolve({error: false, message: 'finished create field in table'});
                            }
                            , (transact, err) => resolve({error: true, message: err}));

                    }
                    , (transact, err) => resolve({error: true, message: err}));
            },
            (err) => {
                resolve({error: true, message: err});
            },
        );
    });

}

export function apiLogin(db, dispatch, server, username, password) {
    const serverURL = server.toLowerCase() + LOGIN_URL;
    const userInfo = {"username": "" + username + "", "password": "" + password + ""};
    return dispatch => {
        dispatch(onLoginPending());
        fetch(serverURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
            timeout: 50
        })
            .then(res => res.json())
            .then(res => {
                setOfflineData(db, {user: username, pwd: password});
                dispatch(onLoginSuccess(res));
                //return res.products;
            })


            .catch(error => {
                console.log(error);
                dispatch(onLoginError(error));
            })
    }
}


import {openLocalDatabase} from "../../api/database";
import {Observable} from "redux";
import {of} from "rxjs";
import {createTableAfmFldV2, getLocalParamV2} from "../../api-v2/database";
import {generateUserNextState, getUserObj, setParameter} from "./user";
import {map, switchMap} from "rxjs/operators";
import {getTranslation, retrieveTranslationFromApi} from "../../api/translation";

export function init(state): Observable<any> {
    const response = openLocalDatabase(state.database.dbName);
    let nextState = state;
    if (response.db !== null) {
        nextState.database.error = response.error;
        nextState.database.db = response.db;
        nextState.database.loading = response.loading;
        nextState.database.initialized = response.initialized;

        return createTableAfmFldV2(nextState.database.db).pipe(switchMap((data) => {
                if (data.error) {
                    return of({error: true, state: nextState});
                } else {
                    return getLocalParamV2(nextState.database.db).pipe(switchMap((paramV2) => {
                        if (paramV2.error.error) {
                            return of({error: true, state: nextState});
                        } else {
                            if (paramV2.data.length) {
                                nextState = generateUserNextState(nextState, setParameter(paramV2.data, getUserObj(nextState.user)));
                            }
                            nextState.database.loading.loading = false;
                            nextState.user.initialized = true;
                            return getTranslation(nextState.database.db).pipe(switchMap((getTranslationResponse) => {
                                console.log('mon getTranslationResponse', getTranslationResponse.data.length);
                                if (getTranslationResponse.data.length > 0) {
                                    nextState.translation.data = getTranslationResponse.data;
                                    return of({error: false, state: nextState});
                                } else {
                                    return retrieveTranslationFromApi(nextState.user.server, nextState.database.db).pipe(map((result) => {
                                        if (!result.error)
                                            console.log('mon result api', result.data.length);
                                        else
                                            console.log('mon result api', result);
                                        nextState.translation.data = (result.error) ? [] : result.data;
                                        return {error: result.error, state: nextState};
                                    }));
                                }
                            }));
                        }
                    }))
                }
            }
        ));
    } else {
        return of({error: true, state: nextState});
    }
}

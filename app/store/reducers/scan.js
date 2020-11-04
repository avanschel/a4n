
import {
    SCAN_CODE_BAR_CHANGE,
    SCAN_CONTAINER_CHANGE,
    SCAN_DEF_FIELD,
    SCAN_SET_STATE,
    SCAN_SET_SURVEY
} from "../actions/actions";
import {initialState} from "../initialState";
export default function scanStatus(state=initialState.scan,action){

    switch(action.type){
        case SCAN_CODE_BAR_CHANGE:
            return action.state;
        case SCAN_CONTAINER_CHANGE:
            return action.state;
        case SCAN_DEF_FIELD:
            return action.state;
        case SCAN_SET_SURVEY:
            return action.state;
        case SCAN_SET_STATE:
            return action.state;
        default:
            return state;
    }
}

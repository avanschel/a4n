import {initialState} from "../initialState";
import {INIT_APP} from "../actions/actions";

export default function globalStateManagement(state = initialState, action) {

    switch (action.type) {
        case INIT_APP:
            return action.state;
        default:
            return state;
    }
}


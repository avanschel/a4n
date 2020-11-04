import {PROGRESS_FINISHED, PROGRESS_RUNNING, PROGRESS_UPDATE} from "../actions/actions";
export default function progressManagement(state={progress:false,text:'',percent:0},action){

    switch(action.type){
        case PROGRESS_RUNNING:
            return action.state;
        case PROGRESS_UPDATE:
            return action.state;
        case PROGRESS_FINISHED:
            return action.state;
        default:
            return state;
    }
}

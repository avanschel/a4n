import {initialState} from "../initialState";

export function translate(screen, key, translationData) {
    const translation = (translationData && translationData.hasOwnProperty('data') && translationData.data.length > 0) ? translationData.data.filter((tl) => {
        return tl.screen_id === screen && tl.text_id === key
    }) : '';
    return (translation.length > 0) ? translation[0].text_title : key;
}

function translationManagement(state = initialState.translation, action) {

    return state;
}

export default translationManagement;

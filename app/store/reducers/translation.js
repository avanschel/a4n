import {initialState} from "../initialState";

export function translate(screen, key, translationData) {
    const translation = translationData.data.filter((tl) => {
        return tl.screen_id === screen && tl.text_id === key
    });
    console.log('my translation', translation);
    return (translation.length > 0) ? translation[0].text_title : key;
}

function translationManagement(state = initialState.translation, action) {

    return state;
}

export default translationManagement;
export function setParameter(data,old){
    let response = old;
    for(let elem of data){
        response.server = (elem.name==='server')? elem.value: response.server;
        response.username = (elem.name==='username' || elem.name==='user')? elem.value: response.username;
        response.password = (elem.name==='password' || elem.name==='lock')? elem.value: response.password;
    }
    return response;
}

export function getUserObj(data){
    return {server:data.server,username:data.username,password:data.password};
}
export function generateUserNextState(oldValue,newValue){
    let nextState = oldValue;
    nextState.user.username=newValue.username;
    nextState.user.server=newValue.server;
    nextState.user.password=newValue.password;
    return nextState;
}
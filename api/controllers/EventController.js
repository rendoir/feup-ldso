function isValidEvent(event) {
    if(!isValidString(event.title))
        return false;

    //console.log(event.title);

    return true;
}

function addEvent(event) {
    
}

function isValidString(string) {
    return string && string.trim().length;
}

module.exports = {
    isValidEvent: isValidEvent,
    addEvent: addEvent
}
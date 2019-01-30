const convertToUtf8Bytes = value => {
    let myBuffer = [];
    let str = value;
    //let buffer = new Buffer(str, 'utf16le');
    let buffer = new Buffer(str, 'utf8');
    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
}

module.exports = {
    convertToUtf8Bytes
}



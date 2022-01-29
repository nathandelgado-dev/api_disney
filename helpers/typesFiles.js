const validatetypeFiles = (file, typesFile = ['png', 'jpg', 'jpeg', 'gif']) => {

    return new Promise((resolve, reject) => {

        const { name } = file;
        const nombreSplited = name.split('.');
        const typeFile = nombreSplited[nombreSplited.length - 1];

        //Validate extension type 
        if (!typesFile.includes(typeFile)) {
            return reject(`The type of file ${ typeFile } is not permitted. This are ${ typesFile }`);
        }
    });
}

module.exports = {
    validatetypeFiles
}
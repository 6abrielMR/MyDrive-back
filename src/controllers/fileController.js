const fs = require('fs');
const path = require('path');
const mimeTypes = require('mime-types');
const config = require('../../config/config');

const controller = {};

// Global vars
var data;

// Utils functions
async function isExistElement(pathToCheck) {
    let isCurrentExist = {};
    try {
        if (fs.statSync(pathToCheck).isDirectory()) {
            console.log("Is directory");
            isCurrentExist.state = true;
            isCurrentExist.type = "dir";
        }
        else {
            console.log("Is file");
            isCurrentExist.state = true;
            isCurrentExist.type = "file";
        }
    } catch(err) {
        console.log("Error to check into the local files =>\n" + err);
        isCurrentExist.state = false;
        isCurrentExist.type = "none";
    };

    console.log(isCurrentExist);

    return isCurrentExist;
}

// Routes
controller.upload = (req, res) => {
    data = {};
    if (!req.files || Object.keys(req.files) === 0) {
        console.log("Error to save files.");
        data.state = "Err";
        data.message = "No se encontraron archivos para subir.";
        data.data = {};
        return res.status(500).send(data);
    }

    let files = req.files.file;
    let currentPath;
    let stateSave = true;
    for (let file of files) {
        currentPath = currentPathSave + "/" + Date.now() + "_" + file.name.split(".")[0] + "." + mimeTypes.extension(file.mimetype);
        if (isExistElement(currentPath)) {
            console.log("Error to save file.");
            data.state = "Err";
            data.message = "Ya existe un archivo con el nombre '" + file.name + "'.";
            data.data = {};
            stateSave = false;
        }
        
        if (!stateSave) break;
        
        file.mv(path.join(config.PATH_BASE, currentPath), err => err ? stateSave = false : stateSave = true);
        
        if (!stateSave) break;
    }

    if (stateSave) {
        data.state = "Success";
        data.message = "Se subieron todos los archivos exitosamente.";
        data.data = {};
    } else {
        data.state = "Err";
        data.message = "No se pudo subir todos los archivos.";
        data.data = {};
    }

    return res.status(data.state == "Err" ? 500 : 200).send(data);
};

controller.download = async (req, res) => {
    data = {};

    let stateDownload = true;
    let { fileToDownload } = req.body;
    let fullPathToDownload = fileToDownload.split(".");
    let mimetype = mimeTypes.lookup(path.join(config.PATH_BASE, fileToDownload));
    fullPathToDownload = fileToDownload.split("/");
    let filename = fullPathToDownload[fullPathToDownload.length - 1];
    let isExist = await isExistElement(path.join(config.PATH_BASE, fileToDownload));
    if (isExist.state) {
        try {
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', mimetype);
        } catch (err) {
            console.log("Error to download file => " + err);
            data.state = "Err";
            data.message = "No se pudo descargar el archivo.";
            data.data = {};
            stateDownload = false;
        }
    } else {
        console.log("Error to download files.");
        data.state = "Err";
        data.message = "No existe el archivo a descargar.";
        data.data = {};
        stateDownload = false;
    }

    if (stateDownload)
        return res.download(path.join(config.PATH_BASE, fileToDownload));
    return res.status(500).send(data);
};

module.exports = controller;
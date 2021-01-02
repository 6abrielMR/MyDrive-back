const fs = require('fs');
const path = require('path');
const util = require('util');
const rename = util.promisify(fs.rename);

const controller = {};
const pathBase = "./public/base/";

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
controller.all = (req, res) => {
    let { pathToSearch } = req.body;
    let currentFolder = path.join(pathBase, pathToSearch);
    let files = [], dirs = [];
    let data = {};
    data.state = "Err";
    data.data = {};
    fs.readdirSync(currentFolder).forEach(element => {
        if (fs.statSync(currentFolder + '/' + element).isFile())
            files.push(element);
        else
            dirs.push(element);
        
        if (files.length > 0)
            data.data.files = [files];
        if (dirs.length > 0)
            data.data.dirs = [dirs];
    });

    if (Object.keys(data.data).length === 0) {
        data.state = "Empty";
        data.message = "No hay archivos en '" + currentFolder + "'."
        data.data = {};
    } else {
        data.state = "Full";
        data.message = "Archivos encontrados en '" + currentFolder + "'.";
    }

    res.status(200).send(data);
};

controller.delete = async (req, res) => {
    let { elementName } = req.body;
    let deleteFolder = path.join(pathBase, elementName);
    let isExist = await isExistElement(deleteFolder);
    data = {};
    if (isExist.state) {
        fs.rmdir(deleteFolder, { recursive: true }, (err) => {
            if (err) {
                console.log("Error to delete the folder =>\n" + err);
                data.state = "Err";
                data.message = "La carpeta fue eliminada en '" + deleteFolder + "'.";
                data.data = {};
            } else {
                console.log("Eliminado correctamente.");
                data.state = "Success";
                data.message = isExist.type == "dir" 
                                    ? "La carpeta fue eliminada en" + " '" + deleteFolder + "'."
                                    : "El archivo fue eliminado en" + " '" + deleteFolder + "'.";
                data.data = {};

                console.log(deleteFolder);
            }
            return res.status(data.state == "Err" ? 500 : 200).send(data);
        });
    } else {
        console.log("Error to delete element.");
        data.state = "Err";
        data.message = "No existe el elemento en la ruta '" + deleteFolder + "'.";
        data.data = {};
        return res.status(data.state == "Err" ? 500 : 200).send(data);
    }
};

controller.move = async (req, res) => {
    let { currentPath } = req.body;
    let { pathToMove } = req.body;
    let oldPath = path.join(pathBase, currentPath);
    let newPath = path.join(pathBase, pathToMove);
    let isExist = await isExistElement(oldPath);
    data = {};
    if (isExist.state) {
        try {
            await rename(oldPath, newPath);
            data.state = "Success";
            data.message = isExist.type == "dir"
                                ? "La carpeta fue movida a" + " '" + newPath + "'."
                                : "El archivo fue movido a" + " '" + newPath + "'.";
            data.data = {};
        } catch (err) {
            console.log("Error to move element =>\n" + err);
            data.state = "Err";
            data.message = "No se pudo mover el elemento a '" + newPath + "'.";
            data.data = {};
        }

        return res.status(data.state == "Err" ? 500 : 200).send(data);
    } else {
        console.log("Error to move element.");
        data.state = "Err";
        data.message = "No existe el elemento en la ruta '" + newPath + "'.";
        data.data = {};
        return res.status(data.state == "Err" ? 500 : 200).send(data);
    }
};

controller.rename = async (req, res) => {
    let { currentName } = req.body;
    let { nameToChange } = req.body;
    let oldName = path.join(pathBase, currentName);
    let newName = path.join(pathBase, nameToChange);
    let isExist = await isExistElement(newName);
    data = {};
    if (isExist.state) {
        console.log("Error to rename element.");
        data.state = "Err";
        data.message = "Ya existe un archivo con el mismo nombre.";
        data.data = {};
        return res.status(data.state == "Err" ? 500 : 200).send(data);
    } else {
        try {
            await rename(oldName, newName);
            data.state = "Success";
            data.message = "El nombre fue cambiado exitosamente.";
            data.data = {};
        } catch (err) {
            console.log("Error to rename element =>\n" + err);
            data.state = "Err";
            data.message = "No se pudo cambiar el nombre.";
            data.data = {};
        }

        return res.status(data.state == "Err" ? 500 : 200).send(data);
    }
};

controller.upload = (req, res) => {

};

module.exports = controller;
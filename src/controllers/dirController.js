const fs = require('fs');
const path = require('path');

const controller = {};
const pathBase = "./public/base/";

// Globals vars
var data;

controller.create = (req, res) => {
    let { folderName } = req.body;
    let newFolder = path.join(pathBase, folderName);
    data = {};
    return fs.mkdir(newFolder, { recursive: true }, (err) => {
        if (err) {
            console.log("Error to create the folder =>\n" + err);
            data.state = "Err";
            data.message = "No fue posible crear la carpeta '" + folderName + "'.";
            data.data = {};
        } else {
            console.log("Carpeta creada.");
            data.state = "Success";
            data.message = "La carpeta fue creada en '" + newFolder + "'.";
            data.data = {};
        }

        return res.status(data.state == "Err" ? 500 : 200).send(data);
    });
};

controller.move = (req, res) => {
    
};

module.exports = controller;
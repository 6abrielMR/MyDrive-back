const fs = require('fs');
const path = require('path');

const controller = {};
const path_base = "./public/base/";

controller.all = (req, res) => {
    let { folder } = req.body;
    let currentFolder = path.join(path_base, folder);
    let data = {};
    data.state = "Err";
    data.data = {};
    fs.readdirSync(currentFolder).forEach(file => {
        if (fs.statSync(currentFolder + '/' + file).isFile())
            data.data.files = [file]; 
        else
            data.data.dirs = [file];
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

controller.upload = (req, res) => {
    res.status(200).send({
        message: "Archivo subido."
    });
};

module.exports = controller;
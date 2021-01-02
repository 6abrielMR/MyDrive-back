const errorsManage = {};

errorsManage.logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};

errorsManage.errorHandler = (err, req, res, next) => {
    res.status(500).send({
        "state": "Err",
        "message": "Error al realizar el proceso en el servidor.",
        "data": {}
    });
}

module.export = errorsManage;
module.exports = (err, req, res, next) => {
    res.status(500).send({
        "state": "Err",
        "message": "Error al realizar el proceso en el servidor.",
        "data": {}
    });
};
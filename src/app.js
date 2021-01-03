const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const err = require('./middlewares/manageError');
const config = require('../config/config');

const app = express();

// routes
const fileRoutes = require('./routes/file');
const dirRoutes = require('./routes/dir');
const generalRoutes = require('./routes/general');
const { urlencoded } = require('express');

// settings
app.set('port', config.PORT);

// middlewares
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());
app.use(cors());

// errors
app.use(err);

// routes
app.use('/', generalRoutes);
app.use('/dir', dirRoutes);
app.use('/file', fileRoutes);

// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});
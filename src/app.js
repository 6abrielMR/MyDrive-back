const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const app = express();

// routes
const fileRoutes = require('./routes/file');
const dirRoutes = require('./routes/dir');
const { urlencoded } = require('express');

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use('/', fileRoutes);
app.use('/dir', dirRoutes);

// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});
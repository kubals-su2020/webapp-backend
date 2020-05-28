'use strict';

module.exports = (app) => {
    const routes = require('./routes/index');
    routes(app);
};
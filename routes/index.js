const routes = require("express").Router();

const pages = require('./pages');
const content = require('./content');

routes.use('/pages', pages);
routes.use('/content', content);

routes.get('/', (request, response) => {
    response.status(200).json({
        message: 'Connected!'
    });
});

module.exports = routes;
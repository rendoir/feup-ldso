// UI:  http://localhost:3030/docs
// Document:  http://localhost:3030/api-docs

module.exports = {
    init(app){

        var fs = require('fs'),
            jsyaml = require('js-yaml'),
            path = require('path'),
            swaggerTools = require('oas-tools');

        var options = {
            controllers: './api/controllers'
        };

        var spec = fs.readFileSync(path.join('acontece-na-uporto.yaml'), 'utf8');
        var swaggerDoc = jsyaml.safeLoad(spec);

        swaggerTools.initializeMiddleware(swaggerDoc, app,  function(middleware) {

            app.use(middleware.swaggerMetadata());

            app.use(middleware.swaggerValidator());

            app.use(middleware.swaggerRouter(options));

            app.use(middleware.swaggerUi());

        });
    }
};

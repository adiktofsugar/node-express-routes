// Route definitions
var base = require('./apps/base').routes,
    users = require('./apps/users').routes;

// This is going to be treated as a module.
// Just the actual routes object...
var urls = {},
    routes = {
        'base' : {
            path : '',
            include : base
        },
        'users' : {
            path : '/users',
            include : users
        }
    };

var verbs = ['all', 'get' ,'post', 'delete', 'put'],
    makeRoute = function (routeObj, app, basePath) {
        var module = routeObj.include,
            urlObj = routeObj.urlObj || urls;

        basePath = basePath || '';

        if (module != undefined) {
            basePath += routeObj.path;
            if (routeObj.name) {
                urlObj = urlObj[ routeObj.name ] = {};
            }

            for (var routeName in module) {
                routeObj = module[routeName];

                routeObj.urlObj = urlObj;
                routeObj.name = routeName;

                makeRoute(routeObj, app, basePath);
            }
        } else if (routeObj.path != undefined) {

            // Is actually a route
            // Assign the paths
            var path = basePath + routeObj.path;

            // Now go through the verbs and actually assign them
            verbs.forEach(function (verb) {
                if (routeObj[verb]) {
                    app[verb](path, routeObj[verb]);
                }
            });

            // And add an entry in this urlObj
            routeObj.urlObj[ routeObj.name ] = path;
        }
    };

exports.init = function (app) {
    makeRoute({
        path : '',
        include : routes
    }, app);

    console.dir(urls);
    app.set("urls", urls);
};
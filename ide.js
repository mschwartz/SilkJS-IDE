/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 8:57 AM
 * To change this template use File | Settings | File Templates.
 */

Config.extend({
    mysql: {
    	host: 'localhost',
    	user: 'mschwartz',
    	passwd: '',
    	db: 'ide'
    },
    numChildren: 10,
    documentRoot: 'docroot'
});

function debug(o) {
	if (Util.isString(o)) {
		log(o);
	}
	else {
		log(Util.print_r(o));
	}
}

require.path.unshift('./server');

Server = require('Server');

var Constants = require('core/constants'),
    ServiceRegistry = require('core/ServiceRegistry'),
    Schemas = require('core/schemas'),
    Spine = require('core/Spine');

//include('server/managers/ProjectsManager.js');
//include('server/managers/UsersManager.js');
//include('server/managers/UserSessionsManager.js');

//include('server/services/UsersService.js');
//include('server/services/ProjectsService.js');

var UserSessionsManager = require('managers/UserSessionsManager');

var GitHubService = require('services/GitHubService'),
    ProjectsService = require('services/ProjectsService'),
    UsersService = require('services/UsersService');

var phpjs = require('phpjs'),
    empty = phpjs.empty,
    sprintf = phpjs.sprintf;

HttpChild.requestHandler = function() {
	var user = req.user = UserSessionsManager.getCurrentUser();
	req.userId = user.userId;
	req.projectId = user.projectId;
};

function Service_action() {
	res.data.isService = true;
	ServiceRegistry.invoke(req.data.method);
}

/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 8:57 AM
 * To change this template use File | Settings | File Templates.
 */

Config.mysql = {
	host: 'localhost',
	user: 'mschwartz',
	passwd: '',
	db: 'ide'
};
Config.documentRoot = 'docroot';

function debug(o) {
	if (Util.isString(o)) {
		log(o);
	}
	else {
		log(Util.print_r(o));
	}
}

include('server/core/constants.js');
include('server/core/ServiceRegistry.js');
include('server/core/schemas.js');
include('server/core/Spine.js');

include('server/managers/ProjectsManager.js');
include('server/managers/UsersManager.js');
include('server/managers/UserSessionsManager.js');
include('server/services/UsersService.js');
include('server/services/ProjectsService.js');

HttpChild.requestHandler = function() {
	var user = UserSessionsManager.getCurrentUser();
	req.userId = user.userId;
	req.projectId = user.currentProjectId;
	log(Util.print_r(user));
};

function Service_action() {
	res.data.isService = true;
	ServiceRegistry.invoke(req.data.method);
}

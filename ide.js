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

silk.include('server/managers/ProjectsManager.js');
silk.include('server/managers/UsersManager.js');
silk.include('server/managers/UserSessionsManager.js');
silk.include('server/services/UsersService.js');
silk.include('server/services/ProjectsService.js');

HttpChild.requestHandler = function() {
	var user = UserSessionsManager.getCurrentUser();
	req.userId = user.userId;
	req.projectId = user.projectId;
};

function Service_action() {
	res.data.isService = true;
	ServiceRegistry.invoke(req.data.method);
}

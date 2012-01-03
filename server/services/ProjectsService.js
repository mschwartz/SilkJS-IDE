/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 9:14 AM
 * To change this template use File | Settings | File Templates.
 */

ProjectsService = ServiceRegistry.register('Projects', function() {
	return {
		treeData: function() {
			Json.success(ProjectsManager.treeData({ userId: req.userId, nodeId: req.projectId }));
		}
	};
}());
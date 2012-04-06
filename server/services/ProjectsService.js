/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 9:14 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

ServiceRegistry.register('Projects', function() {
    var Json = require('Json'),
        fs = require('fs'),
        ProjectsManager = require('managers/ProjectsManager').ProjectsManager;
	return {
		treeData: function() {
			Json.success(ProjectsManager.treeData(req.projectId));
		},
		getFile: function() {
			return Json.success({
				body: fs.readFile(ProjectsManager.filePath(req.projectId, req.data.path))
			});
		},
		putFile: function() {
			var realPath = ProjectsManager.filePath(req.projectId, req.data.path);

			if (req.data.create) {
				if (fs.exists(realPath)) {
					Json.failure('File already exists');
				}
			}
			if (!fs.writeFile(realPath, req.data.content)) {
				Json.failure(fs.error());
			}
			Json.success();
		},
		deleteFile: function() {
			var realPath = ProjectsManager.filePath(req.projectId, req.data.path);
			if (!fs.unlink(realPath)) {
				Json.failure(fs.error());
			}
			Json.success();
		},
		renameFile: function() {
			var oldPath = ProjectsManager.filePath(req.projectId, req.data.oldPath),
				newPath = ProjectsManager.filePath(req.projectId, req.data.newPath);
			if (fs.exists(newPath)) {
				Json.failure('File already exists');
			}
			if (fs.rename(oldPath, newPath) < 0) {
				Json.failure(fs.error());
			}
			Json.success();
		}
	};
}());

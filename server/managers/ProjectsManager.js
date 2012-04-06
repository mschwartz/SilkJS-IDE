/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 8:53 AM
 * To change this template use File | Settings | File Templates.
 */

/*global exports */
"use strict";

var ProjectsManager = (function() {
    var fs = require('fs'),
        phpjs = require('phpjs'),
        sprintf = phpjs.sprintf;

	return {
		filePath: function(projectId, relPath) {
			return 'projects' + sprintf("%012d", projectId).replace(/(\d\d\d)/g, '/$1') + relPath;
		},
		putOne: function(example) {
			example.type = 'Projects';
			if (example.nodeId) {
				return Spine.putOne(example);
			}
			example.nodeId = 0;
			var project = Spine.putOne(example);
			var projectPath = 'projects/' + sprintf("%012d", project.nodeId).replace(/(\d\d\d)/g, '/$1');
			process.exec('mkdir -p '+projectPath);
			process.exec('rsync -a default-project/ ' + projectPath + '/');
			return project;
		},
		treeData: function(projectId) {
			var project = Spine.findOne({ nodeId: projectId, type: 'Projects' });
			var projectPath = 'projects' + sprintf("%012d", project.nodeId).replace(/(\d\d\d)/g, '/$1');
			var data = {
				type: 'project',
				title: project.title,
				children: []
			};
			function recurse(path, children) {
				forEach(fs.readDir(projectPath + path), function(entry) {
					if (fs.isFile(projectPath + path + entry)) {
						children.push({
							type: 'file',
							fsPath: path + entry,
							title: entry,
							children: []
						});
					}
					else {
						var child = {
							type: 'dir',
							fsPath: path + entry,
							title: entry,
							children: []
						};
						children.push(child);
						recurse(path + entry + '/', child.children);
					}
				});
			}
			recurse('/', data.children);
			return data;
		}
	}
}());

if (exports) {
    exports.ProjectsManager = ProjectsManager;
}

/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 8:53 AM
 * To change this template use File | Settings | File Templates.
 */

ProjectsManager = (function() {
	return {
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
			var projectPath = 'projects/' + sprintf("%012d", project.nodeId).replace(/(\d\d\d)/g, '/$1');
			var data = {
				type: 'project',
				title: project.title,
				children: []
			};
			function recurse(path, children) {
				forEach(fs.readDir(path), function(entry) {
					if (fs.isFile(entry)) {
						children.push({
							type: 'file',
							title: entry,
							children: []
						});
					}
					else {
						var child = {
							type: 'dir',
							title: 'entry',
							children: []
						};
						children.push(child);
						recurse(path+entry+'/', child.children);
					}
				});
			}
			recurse(projectPath + '/', data.children);
			return data;
		}
	}
}());

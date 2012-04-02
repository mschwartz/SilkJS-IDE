/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 7:33 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var UsersManager = (function() {
	return {
		findOne: function(example) {
			return Schema.findOne('Users', example);
		},
		putOne: function(example) {
			if (example.userId) {
				return Schema.putOne('Users', example);
			}
			var user = Schema.putOne('Users', example);
			var project = ProjectsManager.putOne({ userId: user.userId, title: 'Default' });
			user.currentProjectId = project.nodeId;
			return Schema.putOne('Users', user);
		},

		generateSalt: function(len) {
			return Util.randomString(len || 15);
		},
		hashPassword: function(md5Password, salt) {
			return Util.md5(md5Password + salt);
		}
	};
}());

if (exports) {
    exports = UsersManager;
}
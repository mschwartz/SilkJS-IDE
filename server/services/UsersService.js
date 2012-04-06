/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var UsersManager = require('managers/UsersManager').UsersManager,
    UserSessionsManager = require('managers/UserSessionsManager').UserSessionsManager;

ServiceRegistry.register('Users', function() {
    var Json = require('Json');

	return {
		register: function() {
			var email = req.data.email;
			var password = req.data.password;
			var user = UsersManager.findOne({ email: email });
			if (user.userId) {
				Json.failure('* User with that email address already exists.');
			}
			var salt = UsersManager.generateSalt();
			var hashedPassword = UsersManager.hashPassword(password, salt);
			UsersManager.putOne({
				email: email,
				password: hashedPassword,
				salt: salt
			});
			Json.success();
		},
		login: function() {
			var email = req.data.email;
			var password = req.data.password;
			var user = UsersManager.findOne({ email: email });

			var hashedPassword = UsersManager.hashPassword(password, user.salt);
			if (hashedPassword !== user.password) {
				Json.failure();
			}
			UserSessionsManager.initUserSession(user.userId, user.currentProjectId);
			Json.success();
		}
	};
}());

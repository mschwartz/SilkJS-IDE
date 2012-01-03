/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */

UsersService = ServiceRegistry.register('Users', function() {
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
			debug(hashedPassword);
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
			debug(hashedPassword);
			debug(user.password);
			if (hashedPassword !== user.password) {
				Json.failure();
			}
			UserSessionsManager.initUserSession(user.userId, user.currentProjectId);
			Json.success();
		}
	};
}());

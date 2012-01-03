/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 9:21 AM
 * To change this template use File | Settings | File Templates.
 */

UserSessionsManager = (function() {
	return {
		getCurrentUser: function() {
			var now = Util.currentTime();
			var cookieValue = req.data.ideCookie;
			if (!cookieValue) {
				return {
					userId: 0,
					projectId: 0
				};
			}
			var user = SQL.getDataRow('SELECT userId,projectId FROM UserSessions WHERE UserSessions.cookie=' + SQL.quote(cookieValue));
			if (!user) {
				return {
					userId: 0,
					projectId: 0
				};
			}
			var userId = user.userId || 0;
			var projectId = user.projectId || 0;
			SQL.update('UPDATE UserSessions SET lastAccess='+now+' WHERE cookie='+SQL.quote(cookieValue));
			return user;
		},
		initUserSession: function(userId, projectId) {
			var now = Util.currentTime();
			var cookieName = 'ideCookie';
			var cookie = UsersManager.hashPassword(now+req.remote_addr, cookieName);
			res.setCookie(cookieName, cookie);
			SQL.update([
				'REPLACE INTO UserSessions VALUES (',
				'       ' + SQL.quote(cookie) + ',',
				'       ' + SQL.quote(userId) + ',',
				'       ' + SQL.quote(projectId) + ',',
				'       ' + SQL.quote(now) + ',',
				'       ' + SQL.quote(now),
				')'
			]);
		}
	}
}());
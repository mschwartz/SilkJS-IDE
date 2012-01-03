/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 11:31 AM
 * To change this template use File | Settings | File Templates.
 */
(function() {
	SQL = new MySQL();
	SQL.connect();
	function IP() {
		return (global.req && req.remote_addr) ? req.remote_addr : '127.0.0.1';
	}
	function USERID() {
		return (global.req && req.userId) ? req.userId : 1;
	}
	Schema.add({
		name: 'Users',
		fields: [
			{ name: 'userId', type: 'int', autoIncrement: true, defaultValue: 0 },
			{ name: 'status', type: 'int', defaultValue: 1 },
			{ name: 'email', type: 'varchar', size: 64, defaultValue: '' },
			{ name: 'password', type: 'varchar', size: 32, defaultValue: '', serverOnly: true },
			{ name: 'salt', type: 'varchar', size: 16, defaultValue: function() { return UsersManager.generateSalt(); }, serverOnly: true },
			{ name: 'currentProjectId', type: 'int', defaultValue: 1 },
			{ name: 'lastLogin', type: 'int', defaultValue: Util.currentTime },
			{ name: 'lastAccess', type: 'int', defaultValue: Util.currentTime },
			{ name: 'creator', type: 'int', defaultValue: 1 },
			{ name: 'created', type: 'int', defaultValue: Util.currentTime },
			{ name: 'creatorIp', type: 'varchar', size: 15, defaultValue: IP },
			{ name: 'editor', type: 'int', defaultValue: 1 },
			{ name: 'edited', type: 'int', defaultValue: Util.currentTime },
			{ name: 'editorIp', type: 'varchar', size: 15, defaultValue: IP }
		],
		primaryKey: 'userId',
		indexes: [
			'email'
		],
		engine: 'InnoDB',
		onCreate: function() {
			var salt = UsersManager.generateSalt();
			UsersManager.putOne({
				userId: 0,
				status: 1,
				email: 'admin@silkjs.org',
				password: UsersManager.hashPassword(Util.md5('admin'), salt),
				salt: salt
			});
		}
	});

	Schema.add({
		name: 'UserSessions',
		fields: [
			{ name: 'cookie', type: 'varchar', size: 32 },
			{ name: 'userId', type: 'int' },
			{ name: 'projectId', type: 'int' },
			{ name: 'loginTime', type: 'int' },
			{ name: 'lastAccess', type: 'int' }
		],
		engine: 'memory',
		primaryKey: 'cookie'
	});

	Schema.add({
		name: 'Nodes',
		fields: [
			{ name: 'nodeId', type: 'int', autoIncrement: true, defaultValue: 0 },
			{ name: 'version', type: 'int', defaultValue: 0, noQuery: true },	// noQuery indicates not to include in Schema.where() result
			{ name: 'type', type: 'varchar', size: 32, defaultValue: 'unknown' },
			// creation info
			{ name: 'creator', type: 'int', defaultValue: USERID },
			{ name: 'created', type: 'int', defaultValue: Util.currentTime },
			{ name: 'creatorIp', type: 'varchar', size: 15, defaultValue: IP }
		],
		primaryKey: 'nodeId',
		indexes: [
			'version',
			'type',
			'creator',
			'created'
		]
	});

	Schema.define({
		name: 'NodeData',
		fields: [
			{ name: 'nodeId', type: 'int' },
			{ name: 'version', type: 'int' },
			{ name: 'title', type: 'varchar', size: 255, defaultValue: 'Untitled' },
			{ name: 'filename', type: 'varchar', size: 255, defaultValue: 'untitled' },
			// modification user/timestamp info
			{ name: 'editor', type: 'int', defaultValue: USERID },
			{ name: 'edited', type: 'int', defaultValue: Util.currentTime },
			{ name: 'editorIp', type: 'varchar', size: 15, defaultValue: IP }
		],
		primaryKey: 'nodeId,version',
		indexes: [
			'title',
			'filename',
			'title',
			'editor',
			'edited'
		]
	});

	Schema.add({
         name: 'Spine',
         fields: [
                 { name: 'parentId', type: 'int' },
                 { name: 'nodeId', type: 'int' }
         ],
         primaryKey: 'parentId,nodeId',
         indexes: [
                 'parentId'
         ]
 	});

	Schema.extend('NodeData', {
		name: 'Projects',
		fields: [
			{ name: 'userId', type: 'int' }
		],
		indexes: [
			'userId'
		]
	});
}());
/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 12:39 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.LoginDialog = function() {
	var id = Ext.id();
	top.document.title = 'SilkJS IDE Login';
	var dialog = new Ext.Window({
		title: 'Log In',
		modal: true,
		y: 150,
		width: 450,
		height: 260,
		layout: 'fit',
		items: [
			{
				xtype: 'form',
				frame: true,
				labelWidth: 70,
				items: [
					{
						xtype: 'displayfield',
						hideLabel: true,
						value: 'Enter your username and password and click the LOGIN button.<br/><br/>'
					},
					{
						xtype: 'textfield',
						id: 'username-'+id,
						fieldLabel: 'Username',
						anchor: '100%'
					},
					{
						xtype: 'textfield',
						id: 'password-'+id,
						inputType: 'password',
						fieldLabel: 'Password',
						anchor: '100%'
					},
					{
						xtype: 'displayfield',
						hideLabel: true,
						value: '<br/><b>Forgot your password?</b><br/><br/>Enter your Username in this form and click the FORGOT PASSWORD button. An email will be sent to you with instructions about changing your password and recovering access to your account.<br/><br/>'
					}
				]
			}
		],
		buttonAlign: 'center',
		buttons: [
			{
				text: 'Log In',
				handler: function() {
					var username = Ext.getCmp('username-'+id).getValue();
					var password = Ext.getCmp('password-'+id).getValue();
					rpc('Users.login', {
						params: {
							email: username,
							password: Ext.util.MD5(password)
						},
						fn: function(o) {
							if (!o.success) {
								ide.AlertDialog('Error', 'Either the email address or password you entered is incorrect.');
								return;
							}
							dialog.close();
							ide.Workspace.open();
						}
					});
				}
			},
			{
				text: 'Forgot Password'
			},
			{
				text: 'Cancel',
				handler: function() {
					dialog.close();
				}
			}
		]
	});
	dialog.show();
	return;
	var loginButton = new Ext.Button({
		text: 'LOGIN',
		icon: '/img/icons/login_icon.gif',
		handler: function() {
			loginPanel.disable();
			var username = loginPanel.findById('username').getValue();
			var password = loginPanel.findById('password').getValue();
			rpc({
				url: '/services/User.login'
				,params: {
					method: 'login'
					,username: username
					,password: password
				}
				,success: function(response) {
					if (response.success) {
//						pwp.user = response.data.user;
//						pwp.userkey = response.data.userkey;
//						pwp.siteid = response.data.siteid;
//						pwp.sites = response.data.sites;
						top.document.title = 'SilkJS IDE';
						dialog.close();
//						pwp.OpenPWP(pwp.siteid);
//						Ext.get('login-time').update(new Date().toLocaleString());
					}
					else {
						alert(response.message + "\n" + response.time);
						loginPanel.enable();
						siteCombo.disable();
					}
				}
			})
		}
	});

	top.document.title = 'SilkJS IDE Login';
	var loginPanel = new Ext.form.FormPanel({
		border: true
//              ,enableKeyEvents: true
		,width: 450
		,height: 75
		,bodyStyle:'padding:5px 5px 0; text-align: middle;'
		,defaults: { width: 300 }
		,labelWidth: 80
		,defaultType: 'textfield'
		,items: [
//			new Ext.form.Label({
//				html: 'Enter your username and password and click the LOGIN button.<br/><br/><br/>'
//			})
			,{
				fieldLabel: 'Username'
				,msgTarget: 'side'
				,anchor: '100%'
				,id: 'username'
				,name: 'username'
			}
			,{
				fieldLabel: 'Password'
				,msgTarget: 'side'
				,anchor: '100%'
				,id: 'password'
				,inputType: 'password'
				,name: 'password'
			}
//			,new Ext.form.Label({
//				html: '<br/>Forgot your password?<br/><br/>Enter your Username in this form and click the FORGOT PASSWORD button. If your CMS account has a valid email address, then an email will be sent to you with instructions about changing your password and recovering access to your account.<br/><br/>'
//			})
		]
//		,bbar: new Ext.Toolbar({
//			items: [
//				new Ext.Button({
//					text: 'FORGOT PASSWORD',
//					handler: function() {
//
//					},
//					icon: '/img/icons/members_icon.gif'
//				}),
//				,'->'
//				,loginButton
//			]
//		})
//		,keys: [
//			{
//				key: [10,13],
//				fn: function() {
//					var bt = loginButton; // Ext.getCmp('login-button');
//					bt.focus();
//					bt.fireEvent('click', bt);
//				}
//			}
//		]
	});

	loginPanel.on('render', function() {
		var cmp = Ext.getCmp('username');
		(function() { cmp.focus(); }).defer(250);
	});

	var config = {
		id: '-win'
		,constrainHeader:true
		,x: 60
		,y: 10
		,modal: true
		,width: 500
		,height: 260
		,maximizable: false
		,minimizable: false
		,resizable: false
		,autoScroll: true
		,closable: false
		,draggable: false
		,layout: 'fit'
		,items: [
//            tabPanel
			loginPanel
		]
		,title: "SilkJS IDE Login"
	};

	var dialog = new Ext.Window(config);

	dialog.show();
	dialog.center();
	var pos = dialog.getPosition();
	dialog.setPosition(pos[0], 100);
	Ext.getCmp('username').focus();
	return dialog;
}

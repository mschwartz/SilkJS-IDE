/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 6:42 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.RegistrationDialog = function() {
	var me = this;
	var id = Ext.id();
	top.document.title = 'SilkJS IDE Register';
	var dialog = new Ext.Window({
		title: 'Register your Account',
		modal: true,
		width: 400,
		height: 200,
		y: 150,
		layout: 'fit',
		items: [
			{
				xtype: 'form',
				frame: true,
				labelWidth: 120,
				items: [
					{
						xtype: 'displayfield',
						hideLabel: true,
						value: 'You will log in using your email address and a password.<br/><br/>'
					},
					{
						xtype: 'textfield',
						id: 'email-'+id,
						fieldLabel: 'Your email address',
						anchor: '100%'
					},
					{
						xtype: 'textfield',
						id: 'pw1-'+id,
						inputType: 'password',
						fieldLabel: 'Choose password',
						anchor: '100%'
					},
					{
						xtype: 'textfield',
						id: 'pw2-'+id,
						inputType: 'password',
						fieldLabel: 'Retype password',
						anchor: '100%'
					}
				]
			}
		],
		buttonAlign: 'center',
		buttons: [
			{
				text: 'Register',
				handler: function() {
					var email = Ext.getCmp('email-'+id).getValue();
					var pw1 = Ext.getCmp('pw1-'+id).getValue();
					var pw2 = Ext.getCmp('pw2-'+id).getValue();
					var errors = [];
					if (!email.length) {
						errors.push('* You must enter an email address.');
					}
					if (!pw1.length || !pw2.length) {
						errors.push('* You must enter and re-enter a password.');
					}
					else {
						if (pw1 != pw2) {
							errors.push('* The passwords you entered do not match.');
						}
					}
					if (errors.length) {
						ide.AlertDialog('Errors in form', '<b>There were errors in your form:</b><br/>' + errors.join('<br/>'));
						return;
					}
					rpc('Users.register', {
						params: {
							email: email,
							password: Ext.util.MD5(pw1)
						},
						fn: function(o) {
							if (!o.success) {
								ide.AlertDialog('Error', o.message || o.exception);
							}
							else {
								dialog.close();
								ide.LoginDialog();
							}
						}
					})
				}
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
};

/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/31/12
 * Time: 6:49 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.GitHubSettingsDialog = function() {
    rpc('GitHub.get', {
        fn: function(o) {
            var dialog = new Ext.Window({
                title: 'GitHub Settings',
                modal: true,
                width: 400,
                height: 130,
                layout: 'fit',
                items: [
                    {
                        xtype: 'form',
                        frame: true,
                        items: [
                            {
                                xtype: 'textfield',
                                id: 'github-username',
                                anchor: '100%',
                                fieldLabel: 'GitHub Username',
                                value: o.username
                            },
                            {
                                xtype: 'textfield',
                                id: 'github-password',
                                inputType: 'password',
                                anchor: '100%',
                                fieldLabel: 'GitHub Password'
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'OK',
                        handler: function() {
                            rpc('GitHub.edit', {
                                params: {
                                    username: Ext.getCmp('github-username').getValue(),
                                    password: Ext.getCmp('github-password').getValue()
                                },
                                fn: function(o) {
                                    if (o.success) {
                                        dialog.close();
                                    }
                                }
                            });
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
        }
    })
};
/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 11:19 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.Home = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var me = this;
		var config = {
			autoLoad: '/client/home.jst',
			bodyStyle: 'padding: 15px;',
			preventBodyReset: true
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.Home.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('ide-home', ide.Home);

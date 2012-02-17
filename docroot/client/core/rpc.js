/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 12:46 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * </p>Shorthand method for doing Ext.Ajax.request to a PWP service.</p>
 *
 * <p>config contains two fields, a params object and a function to call with the JSON decoded response.responseText.</p>
 *
 * @param {string} method e.g. 'Service.method'
 * @param {object} config
 */
function rpc(method, config) {
	config = config || {};
	if (config.mask) {
		ide.Workspace.showLoadingMask(config.mask);
	}
	Ext.Ajax.request({
		method: 'POST',
		url: '/Service',
		params: Ext.apply(config.params || {}, { method: method }),
		success: function(response) {
			if (config.mask) {
				ide.Workspace.hideLoadingMask();
			}
			config.fn && config.fn(Ext.decode(response.responseText));
		}
	});
};

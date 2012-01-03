/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * @fileoverview
 *
 * <p>Registers and manages Services</p>
 */

/** @class ServiceRegistry */
ServiceRegistry = function() {
	/** @private */
	var services = {};
	/** @scope ServiceRegistry */
	return {
		/**
		 * @param {string} name Name of service (should not end with 'Service')
		 * @param {array} hash array of functions, key is name of function and value is the actual function
		 * @returns {void} nothing
		 */
		register: function(name, funcs) {
			services[name+'Service'] = funcs;
		},
		/**
		 * Invoke a Service's method
		 *
		 * @param {string} method (e.g. Asset.list)
		 * @returns {void} nothing - method will typically generate Json output and exit
		 * @throws {NoSuchService} If the requested service is not registered.
		 */
		invoke: function(method) {
			res.data.isService = true;
			var oMethod = method;
			method = method.split('.');
			var serviceName = method[0]+'Service';
			var service = services[serviceName];
			method = method[1];
			console.log('Invoking service ' + serviceName + '.' + method);
			service && service[method] && service[method]();
			console.log('No such service ' + serviceName + '.' + method);
			throw 'No such service ' + serviceName + '.' + method;
		}
	};
}();

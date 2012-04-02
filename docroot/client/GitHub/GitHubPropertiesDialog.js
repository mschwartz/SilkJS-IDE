/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/31/12
 * Time: 7:33 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.GitHubPropertiesDialog = function() {
    rpc('GitHub.properties', {
        fn: function(o) {
            console.dir(Ext.decode(o.responseText));
        }
    });
};

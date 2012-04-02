/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/31/12
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */

/*global res, req */
"use strict";

ServiceRegistry.register('GitHub', function() {
    var Json = require('Json'),
        cURL = require('cURL');

    return {
        edit: function() {
            Schema.putOne('GitHubAccounts', { userId: req.userId, username: req.data.username, password: req.data.password });
            Json.success();
        },
        get: function() {
            Json.success({
                settings: Schema.findOne('GitHubAccounts', { userId: req.userId })
            });
        },
        properties: function() {
            var settings = Schema.findOne('GitHubAccounts', { userId: req.userId });
            if (!settings) {
                Json.failure('Account not configured');
            }
            Json.success(cURL({
                url: 'https://' + settings.username + ':' + settings.password + '@github.com/api/v2/json/user/show/'+settings.username
            }));
        }
    };
}());
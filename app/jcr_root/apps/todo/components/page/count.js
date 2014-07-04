/*global use, granite */

use(["/libs/sightly/js/3rd-party/q.js"], function (Q) {

    'use strict';

    var defer = Q.defer();

    var count = {
        open: 0,
        completed: 0
    };

    granite.resource.getChildren().then(function (children) {
        var i, l;

        for (i = 0, l = children.length; i < l; i += 1) {
            if (children[i].properties.completed == true) {
                count.completed += 1;
            } else {
                count.open += 1;
            }
        }

        defer.resolve(count);
    });
    
    return defer.promise;

});

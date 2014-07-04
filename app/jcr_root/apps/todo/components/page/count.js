/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Please note that some portions of this project are written by third parties
 * under different license terms. Your use of those portions are governed by
 * the license terms contained in the corresponding files. 
 */

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

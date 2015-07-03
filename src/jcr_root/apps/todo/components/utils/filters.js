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

/**
 * Returns an object with following members:
 * {String} selector: The 'active' or 'completed' selector of the request URL
 * {Boolean} isAll: True when showing all items
 * {Boolean} isActive: True when filtering for active items only
 * {Boolean} isCompleted: True when filtering for active items only
 */
use(function () {
    'use strict';

    /**
     * A working replacement to Rhino's useless Array.indexOf(Object) method.
     */
    function contains(array, obj) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] == obj) { //jshint ignore:line, Non-strict comparison to accomodate Rhino's Java type mapping
                return true;
            }
        }
        return false;
    }

    var selector = '';
    var selectorList = request.requestPathInfo.selectors;
    if (contains(selectorList, 'active')) {
        selector = 'active';
    } else if (contains(selectorList, 'completed')) {
        selector = 'completed';
    }

    return {
        selector: selector,
        isAll: selector === '',
        isActive: selector === 'active',
        isCompleted: selector === 'completed'
    };
});
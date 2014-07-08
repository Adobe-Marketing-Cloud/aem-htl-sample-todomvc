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

use(['/libs/sightly/js/3rd-party/q.js', '/apps/todo/components/utils/filters.js'], function (Q, model) {
    'use strict';

    var defer = Q.defer();

    /**
     * Returns the POST path and payload to add a new todo
     */
    function addItemAttributes() {
        return {
            'data-path': resource.getPath() + '/*',
            'data-payload': JSON.stringify({
                'sling:resourceType': properties.get('itemResourceType', '') + '', // The concatenation makes Rhino convert to JS String
                '_charset_': 'utf-8'
            }),
            'data-payload-input': 'jcr:title' // The key of the payload value that has to be added
        };
    }

    /**
     * Returns the POST path and payload to complete/reopen all todo items
     */
    function toggleAllAttributes(activeItems, completedItems) {
        var payload = {};
        var completed = (activeItems.length === 0);
        var toggleItems = completed ? completedItems : activeItems;

        for (var i = 0, l = toggleItems.length; i < l; i++) {
            var path = toggleItems[i];
            payload[path + '/completed'] = !completed;
            payload[path + '/completed@TypeHint'] = 'Boolean';
        }

        return {
            'checked': completed,
            'data-path': currentPage.getPath(),
            'data-payload': JSON.stringify(payload)
        };
    }

    /**
     * Returns the POST path and payload to remove a todo all completed items
     */
    function destroyCompletedAttributes(completedItems) {
        return {
            'data-path': currentPage.getPath(),
            'data-payload': JSON.stringify({
                ':operation': 'delete',
                ':applyTo': completedItems
            })
        };
    }

    // We need to retrieve the todo items first, which are the children of the page
    granite.resource.getChildren().then(function (children) {
        model.allItems = [];
        model.completedItems = [];
        model.activeItems = [];

        for (var i = 0, l = children.length; i < l; i += 1) {
            var path = children[i].path;
            
            model.allItems.push(path);
            // This non-strict comparison is on purpose for Rhino to do the expected
            if (children[i].properties.completed == true) { // jshint ignore:line
                model.completedItems.push(path);
            } else {
                model.activeItems.push(path);
            }
        }

        model.addItemAttributes = addItemAttributes();
        model.toggleAllAttributes = toggleAllAttributes(model.activeItems, model.completedItems);
        model.destroyCompletedAttributes = destroyCompletedAttributes(model.completedItems);

        // Contains an 's' for e.g. in english when there are multiple active items
        // TODO: this should be internationalized more seriously
        model.pluralizeActive = (model.activeItems.length !== 1) ? 's' : '';

        defer.resolve(model);
    });

    // Since getting the page children is an async call, we return a promise
    return defer.promise;
});

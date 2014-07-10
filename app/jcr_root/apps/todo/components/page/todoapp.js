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
 * Returns a promise that gets resolved with an object that has following members:
 * {String} selector: The 'active' or 'completed' selector of the request URL
 * {Boolean} isAll: True when showing all items
 * {Boolean} isActive: True when filtering for active items only
 * {Boolean} isCompleted: True when filtering for active items only
 * {Array} allItems: Resource paths of all todo items
 * {Array} completedItems: Resource paths of the completed items
 * {Array} activeItems: Resource paths of the active items
 * {Object} addItemAttributes: Data attributes to do the POST for adding new todo items
 * {Object} toggleAllAttributes: Data attributes to do the POST for completing/reopening all todo items
 * {Object} destroyCompletedAttributes: Data attributes to do the POST for removing all completed todo items
 */
use(['/libs/sightly/js/3rd-party/q.js', '/apps/todo/components/utils/filters.js'], function (Q, model) {
    'use strict';

    var defer = Q.defer();

    /**
     * Data attributes to do the POST for adding new todo items
     */
    function addItemAttributes() {
        return {
            'data-path': resource.getPath() + '/*',
            'data-payload': JSON.stringify({
                'sling:resourceType': properties.get('itemResourceType', '') + '', // The concatenation makes Rhino convert to JS String
                '_charset_': 'utf-8'
            }),
            // The key of the payload value that has to be added
            'data-payload-input': 'jcr:title'
        };
    }

    /**
     * Data attributes to do the POST for completing/reopening all todo items
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
     * Data attributes to do the POST for removing all completed todo items
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
        // Convenient list of paths to the various todo items
        model.allItems = [];
        model.completedItems = [];
        model.activeItems = [];

        // Let's fill the above arrays
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

        // The data attributes to do the various POST actions
        model.addItemAttributes = addItemAttributes();
        model.toggleAllAttributes = toggleAllAttributes(model.activeItems, model.completedItems);
        model.destroyCompletedAttributes = destroyCompletedAttributes(model.completedItems);

        // This will resolve the promise and make the model object available in the todoapp.html view
        defer.resolve(model);
    });

    // Since getting the page children is an async call, we have to return a promise
    return defer.promise;
});

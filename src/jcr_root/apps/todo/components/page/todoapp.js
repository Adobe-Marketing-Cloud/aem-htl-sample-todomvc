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
 * {Array} displayItems: Resource paths of the items to dispay (based on the isAll, isActive and isCompleted status)
 * {Object} addItemAction: Creates the JSON that describes the POST action for adding new todo items
 * {Object} toggleAllAction: Creates the JSON that describes the POST action for completing/reopening all todo items
 * {Object} destroyCompletedAction: Creates the JSON that describes the POST action for removing all completed todo items
 */
use('/apps/todo/components/utils/filters.js', function (filters) {
    'use strict';

    var model = filters;

    /**
     * Generates JSON for the POST action to add new todo items.
     */
    function addItemAction() {
        return JSON.stringify({
            path: String(resource.path) + '/*',
            data: {
                'sling:resourceType': String(properties.get('itemResourceType')),
                '_charset_': 'utf-8'
            },
            // The key of the value to be added to the data payload.
            append: 'jcr:title'
        });
    }

    /**
     * Generates JSON flr the POST action to complete/reopen all todo items.
     */
    function toggleAllAction(activeItems, completedItems) {
        var data = {},
            completed = (activeItems.length === 0),
            toggleItems = completed ? completedItems : activeItems;

        for (var i = 0, l = toggleItems.length; i < l; i++) {
            var path = toggleItems[i];
            data[path + '/completed'] = !completed;
            data[path + '/completed@TypeHint'] = 'Boolean';
        }

        return JSON.stringify({
            path: String(currentPage.path),
            data: data
        });
    }

    /**
     * Generates JSON for the POST action to remove all completed todo items.
     */
    function destroyCompletedAction(completedItems) {
        return JSON.stringify({
            path: String(currentPage.path),
            data: {
                ':operation': 'delete',
                ':applyTo': completedItems
            }
        });
    }

    // Convenient list of paths to the various todo items.
    model.allItems = [];
    model.activeItems = [];
    model.completedItems = [];

    // We need to retrieve the todo items first, which are the children of the page.
    var children = resource.listChildren();
    for (var index in children) {
        var child = children[index];
        var childPath = child.path;
        var childProperties = child.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
        var isCompleted = childProperties.get('completed') == true; //jshint ignore:line, Accommodate to Rhino's strange way of typing booleans

        model.allItems.push(String(childPath));
        if (isCompleted) {
            model.completedItems.push(String(childPath));
        } else {
            model.activeItems.push(String(childPath));
        }
    }
    
    // Define which items have to be displayed
    if (filters.isAll) {
        model.displayItems = model.allItems;
    } else if (filters.isActive) {
        model.displayItems = model.activeItems;
    } else if (filters.isCompleted) {
        model.displayItems = model.completedItems;
    }

    // The JSON for the POST request of the various actions
    model.addItemAction = addItemAction();
    model.toggleAllAction = toggleAllAction(model.activeItems, model.completedItems);
    model.destroyCompletedAction = destroyCompletedAction(model.completedItems);
    
    return model;
});
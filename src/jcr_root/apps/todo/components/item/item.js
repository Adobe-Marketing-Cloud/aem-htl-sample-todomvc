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
 * {Object} updateItemAction: Creates the JSON that describes the POST action for editing the text of the item
 * {Object} destroyItemAction: Creates the JSON that describes the POST action for removing the item
 * {Object} toggleItemAction: Creates the JSON that describes the POST action for marking the item as complete or active
 */
use(function () {
    'use strict';
    
    var model = {};

    /**
     * Generates JSON for the POST action to edit the text of the item.
     */
    function updateItemAction() {
        return JSON.stringify({
            path: String(resource.path),
            data: {
                '_charset_': 'utf-8'
            },
            // The key of the payload value that has to be added.
            append: 'jcr:title'
        });
    }

    /**
     * Generates the JSON for the POST action to remove the item.
     */
    function destroyItemAction() {
        return JSON.stringify({
            path: String(resource.path),
            data: {
                ':operation': 'delete'
            }
        });
    }

    /**
     * Generates the JSON for the POST action to mark the item as complete or active.
     */
    function toggleItemAction() {
        return JSON.stringify({
            path: String(resource.path),
            data: {
                'completed@TypeHint': 'Boolean'
            },
            // The key of the payload value that has to be added
            append: 'completed'
        });
    }

    // The JSON for the POST request of the various actions
    model.updateItemAction = updateItemAction();
    model.destroyItemAction = destroyItemAction();
    model.toggleItemAction = toggleItemAction();

    return model;
});

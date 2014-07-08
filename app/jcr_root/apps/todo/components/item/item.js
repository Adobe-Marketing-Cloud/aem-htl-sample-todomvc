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

use('/apps/todo/components/utils/filters.js', function (filters) {
    'use strict';
    
    var model = {};
    var path = resource.getPath();

    /**
     * Returns the POST path and payload to add a new todo
     */
    function updateItemAttributes() {
        return {
            'data-path': path,
            'data-payload': JSON.stringify({
                '_charset_': 'utf-8'
            }),
            'data-payload-input': 'jcr:title' // The key of the payload value that has to be added
        };
    }

    /**
     * Returns the POST path and payload to add a new todo
     */
    function destroyItemAttributes() {
        return {
            'data-path': path,
            'data-payload': JSON.stringify({
                ':operation': 'delete'
            })
        };
    }

    /**
     * Returns the POST path and payload to add a new todo
     */
    function toggleItemAttributes() {
        return {
            'data-path': path,
            'data-payload': JSON.stringify({
                'completed@TypeHint': 'Boolean'
            }),
            'data-payload-input': 'completed' // The key of the payload value that has to be added
        };
    }

    // This non-strict comparison is on purpose for Rhino to do the expected
    model.show = filters.isAll || (filters.isCompleted == properties.get('completed', false)) // jshint ignore:line

    if (model.show) {
        model.updateItemAttributes = updateItemAttributes();
        model.destroyItemAttributes = destroyItemAttributes();
        model.toggleItemAttributes = toggleItemAttributes();
        
        // Temporary hack to workaround the data-sly-attribute class bug
        model.updateItemAttributes['class'] = 'edit';
        model.destroyItemAttributes['class'] = 'destroy';
        model.toggleItemAttributes['class'] = 'toggle';
    }

    return model;
});

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
 * {Boolean} show: True when the item is to be displayed (i.e. the all/active/completed filters include it)
 * {Object} updateItemAttributes: Data attributes to do the POST for editing the text of the item
 * {Object} destroyItemAttributes: Data attributes to do the POST for removing the item
 * {Object} toggleItemAttributes: Data attributes to do the POST for marking the item as complete or active
 */
use('/apps/todo/components/utils/filters.js', function (filters) {
    'use strict';
    
    var model = {};
    var path = resource.getPath();

    /**
     * Data attributes to do the POST for editing the text of the item
     */
    function updateItemAttributes() {
        return {
            'data-path': path,
            'data-payload': JSON.stringify({
                '_charset_': 'utf-8'
            }),
            // The key of the payload value that has to be added
            'data-payload-input': 'jcr:title'
        };
    }

    /**
     * Data attributes to do the POST for removing the item
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
     * Data attributes to do the POST for marking the item as complete or active
     */
    function toggleItemAttributes() {
        return {
            'data-path': path,
            'data-payload': JSON.stringify({
                'completed@TypeHint': 'Boolean'
            }),
            // The key of the payload value that has to be added
            'data-payload-input': 'completed'
        };
    }

    // This non-strict comparison is on purpose for Rhino to do the expected
    model.show = filters.isAll || (filters.isCompleted == properties.get('completed', false)) // jshint ignore:line

    if (model.show) {
        // The data attributes to do the various POST actions
        model.updateItemAttributes = updateItemAttributes();
        model.destroyItemAttributes = destroyItemAttributes();
        model.toggleItemAttributes = toggleItemAttributes();
        
        // Unfortunate ugly hack to workaround the data-sly-attribute class bug:
        // When using data-sly-attribute to set multiple attributes at once, it removes
        // the class attribute on the element if it isn't set in the provided object.
        model.updateItemAttributes['class'] = 'edit';
        model.destroyItemAttributes['class'] = 'destroy';
        model.toggleItemAttributes['class'] = 'toggle';
    }

    return model;
});

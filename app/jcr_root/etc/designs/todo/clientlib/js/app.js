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

/*global jQuery, console */

(function ($) {
    'use strict';

    // Variables global to this script
    var todoapp   = $('#todoapp');
    var pagePath  = todoapp.data('page-path');
    var itemsPath = todoapp.data('items-path');
    var itemsType = todoapp.data('items-type');

    /**
     * Generic function to do a sling post and refresh the view
     */
    function updateServerItem(path, data) {
        $.post(path, data).done(function (e) {
            $('#items').load(pagePath);
        });
    }

    /**
     * Add a new todo item using sling default post servlet
     */
    function addItem(event) {
        if (event.which === 13) {
            var input = $(this);
            var value = input.val();
            input.val('');
            updateServerItem(itemsPath, { 'jcr:title': value, '_charset_': 'utf-8', 'sling:resourceType' : itemsType });
        }
    }
    
    /**
     * Toggle the view, show textbox or label
     */
    function editItem(event) {
        var item  = $(this).closest('li');
        var view  = item.find('.view').hide();
        var input = item.find('.edit').show().focus();
    }
    
    /**
     * Submit updated item title and toggle the view to show the item
     */
    function updateItem(event) {
        var input = $(this);
        if (input.is(':visible') && (event.type !== 'keypress' || event.which === 13)) {
            var value = input.val();
            var item  = input.hide().closest('li');
            var path  = item.data('item-path');
            item
                .find('.view').show()
                .find('label').text(value);
            updateServerItem(path, { 'jcr:title': value, '_charset_': 'utf-8' });
        }
    }

    /**
     * Remove a todo item
     */
    function destroyItem() {
        var toggle = $(this);
        var item   = toggle.closest('[data-item-path]');
        var path   = item.data('item-path');
        updateServerItem(path, { ':operation' : 'delete' });
    }

    /**
     * Complete/reopen a todo item
     */
    function toggleItem() {
        var toggle    = $(this);
        var item      = toggle.closest('[data-item-path]');
        var completed = toggle.is(':checked');
        var path      = item.data('item-path');
        updateServerItem(path, { 'completed': completed, 'completed@TypeHint': 'Boolean' });
    }

    // Attaching all events using delegation
    todoapp.on('keypress', '#new-todo', addItem);
    todoapp.on('dblclick', '.view label', editItem);
    todoapp.on('blur keypress', '.edit', updateItem);
    todoapp.on('click', '.destroy', destroyItem);
    todoapp.on('click', '.toggle', toggleItem);

})(jQuery);

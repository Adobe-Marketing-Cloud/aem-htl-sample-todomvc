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

    var todoapp = $('#todoapp');
    var mainPath         = todoapp.data('main-path');
    var footerPath       = todoapp.data('footer-path');
    var itemPath         = todoapp.data('item-path') + '/*';
    var itemResourceType = todoapp.data('item-resource-type');

    /**
     * Generic function to do a sling post and refresh the view
     */
    function updateServerItem(path, data) {
        $.post(path, data).done(function (e) {
            $.get(mainPath, function (data) {
                $('#main').html(data);
            });
            $.get(footerPath, function (data) {
                $('#footer').html(data);
            });
        });
    }

    /**
     * Add a new todo item using sling default post servlet
     */
    function addItem(event) {
        if (event.which === 13) {
            var input = $(this);
            var value = input.val();
            updateServerItem(itemPath, { 'jcr:title': value, '_charset_': 'utf-8', 'sling:resourceType' : itemResourceType });
            input.val('');
        }
    }
    
    /**
     * Toggle the view, show textbox or label
     */
    function editItem(event) {
        var view  = $(this).hide();
        var input = view.parent().find('.edit').show().focus();
    }
    
    /**
     * Display a single list item
     */
    function displayItem(event) {
        var input = $(this);
        if (input.is(':visible') && (event.type !== 'keypress' || event.which === 13)) {
            var item  = input.hide().parent();
            var view  = item.find('.view').show();
            var value = input.val();
            var path  = item.data('item-path');
            view.find('label').text(value);
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
    
    todoapp.on('keypress', '#new-todo', addItem);
    todoapp.on('dblclick', '.view', editItem);
    todoapp.on('blur keypress', '.edit', displayItem);
    todoapp.on('click', '.destroy', destroyItem);
    todoapp.on('click', '.toggle', toggleItem);
})(jQuery);

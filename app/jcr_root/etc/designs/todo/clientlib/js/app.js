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

    /**
     * Complete/reopen all todo items
     */
    function toggleAll() {
        var toggle      = $(this);
        var itemToggles = todoapp.find(toggle.is(':checked') ? '.toggle:checked' : ':not(.toggle:checked)');
        /*
        var item        = toggle.closest('[data-item-path]');
        var completed   = toggle.is(':checked');
        var path        = item.data('item-path');
        updateServerItem(path, { 'completed': completed, 'completed@TypeHint': 'Boolean' });
        */
    }
    
    todoapp.on('keypress', '#new-todo', addItem);
    todoapp.on('dblclick', '.view', editItem);
    todoapp.on('blur keypress', '.edit', displayItem);
    todoapp.on('click', '.destroy', destroyItem);
    todoapp.on('click', '.toggle', toggleItem);
    todoapp.on('click', '#toggle-all', toggleAll);

})(jQuery);

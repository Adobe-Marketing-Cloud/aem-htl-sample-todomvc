/*jslint vars: true */
/*global jQuery, console */

(function ($) {
	'use strict';
    
    /**
     * Toggle the view, show textbox or label
     */
    function editListItem(event) {
        event.stopPropagation();
        var $this = $(this);
        var editField = $(".edit", $this.parent());
        editField.toggle();
        editField.focus();
        $this.toggle();
        
    }
    
    /**
     * Display a single list item
     */
    function displayListItem(event) {
        event.stopPropagation();
        var $this = $(this);
        $(".view", $this.parent()).show();
        $this.hide();
    }
    
    /**
     * generic function to do a sling post and refresh the view
     */
    function updateServerItem(path, data) {
        $.post(path, data).done(function (e) {
            $.get($("#todo-list").data("path"), function (data) {
                $("#todo-list").html(data);
                init();
                resetCounter();
            });
        });
    }
    
    /**
     * reload the counter
     */
    function resetCounter() {
        $("#todo-count").load($("#todo-count").data().res);
    }
    
    /**
     * update a single item
     */
    function updateItem(event) {
        var $this = $(this);
        var path = $(".respath", $this.parent()).attr("value");
        var newvalue = $this.val();
        if (event.which === 13) {
            updateServerItem(path, { title: newvalue, "_charset_": "utf-8"});
        }
    }
    
    /**
     * add a new todo item using sling default post servlet
     */
    function addItem(event) {
        var $this = $(this);
        var path =  "/todomvc/main/listitems/todos/*";
        var newvalue = $this.val();
        if (event.which === 13) {
            updateServerItem(path, { title: newvalue, "_charset_": "utf-8", "sling:resourceType" : "todomvc/item"});
            $this.val("");
            
        }
    }
    
    /**
     * remove an item
     */
    function destroyItem(event) {
        var $this = $(this);
        var path = $(".respath", $this.parent().parent()).attr("value");
        updateServerItem(path, { ":operation" : "delete"});
    }
    
    function toggleItem(event) {
        var $this = $(this);
        var path = $(".respath", $this.parent().parent()).attr("value");
        var value = "completed";
        if ($this.attr("checked") === "checked") {
            value = "nothing";
        }
        updateServerItem(path, { completed: value});
    }
    
    /**
     * reorder item node using sling post servlet
     */
    function reorderItems(event, ui) {
        var movedItemPath = $(".respath", ui.item).val();
        var nextItemPath = $(".resname", ui.item.next()).val();
        console.log("moved item: " + movedItemPath + " next item: " + nextItemPath);
        if (nextItemPath) {
            $.post(movedItemPath, { ":order" : "before " + nextItemPath});
        } else {
            $.post(movedItemPath, { ":order" : "last"});
        }
    }
    
    // initialize app
    function init() {
        $(".edit", todoapp).on("focusout", displayListItem);
        $(".view", todoapp).on("dblclick", editListItem);
        $(".toggle", todoapp).on("click", toggleItem);
        $(".destroy", todoapp).on("click", destroyItem);
        $(".edit", todoapp).keypress(updateItem);
        //$("#todo-list", todoapp).sortable({ cursor: "move" });
        //$("#todo-list", todoapp).disableSelection();
        $("#todo-list", todoapp).on("sortstop", reorderItems);
    }
    
    var todoapp = $("#todoapp");
    $("#new-todo").keypress(addItem);
    
    init();
    
})(jQuery);

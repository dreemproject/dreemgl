/**
 * @class treeview
 * @extends view
 * The treeview control - classic treeview with expandable nodes.
 * 
 * <iframe style="border-radius:7px;border-style:dashed;border-width:thin;width:900px;height:500px" src="http://localhost:2000/apps/docs/example#path=$root/ui/treeview.js"></iframe>
 * 
 */
/**
 * @attribute {Object} [dataset="[object Object]"]
 * the dataset to use for tree expansion. It follows a {name:'test',children:[{name:'child'}]} format
 */
/**
 * @method render
 * the renderfunction for the treeview recursively expands using treeitem subclasses.
 */
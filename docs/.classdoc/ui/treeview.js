/**
 * @class treeview
 * @extends view
 * The treeview control - classic treeview with expandable nodes.
 */
/**
 * @attribute {Object} [dataset="[object Object]"]
 * the dataset to use for tree expansion. It follows a {name:'test',children:[{name:'child'}]} format
 */
/**
 * @method render
 * the renderfunction for the treeview recursively expands using treeitem subclasses.
 */
/**
 * @event select
 */
/**
 * @class treeview.foldbutton
 * @extends button
 * The fold button is a very very flat button.
 */
/**
 * @class treeview.newitemheading
 * @extends view
 * newitemheading combines a few foldbuttons in to a full "item" in the tree
 */
/**
 * @attribute {boolean} folded
 */
/**
 * @attribute {Function} toggleclick
 */
/**
 * @method render
 */
/**
 * @event select
 */
/**
 * @class treeview.treeitem
 * @extends view
 * the treeitem subclass contains 3 controls: a newitemheading, a set of treelines and an optional set of children treeitems in case the current node is expanded
 */
/**
 * @attribute {String} text
 */
/**
 * @attribute {Object} [item="[object Object]"]
 */
/**
 * @method toggle
 * Open/close this node
 */
/**
 * @method processSelect
 * build path for the current treeitem and call the outer selectclick handler
 * @param value
 */
/**
 * @method atConstructor
 */
/**
 * @method render
 */
/**
 * @class treeview.treeline
 * @extends view
 * subclass to render the gridlines of the tree
 */
/**
 * @method render
 */
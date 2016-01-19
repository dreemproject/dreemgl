/**
 * @class docviewer
 * @extends view
 */
/**
 * @attribute {Function} classconstr
 * the class for which to create the documentation. If a string is assigned, the model will be interpreted as a markdown text document.
 */
/**
 * @method parseDoc
 * Build a documentation structure for a given constructor function
 * @param constructor
 */
/**
 * @method render
 */
/**
 * @class docviewer.ClassDocItem
 * @extends view
 * A doc item is an item with a heading, such as methods or attributes
 */
/**
 * @attribute {Object} item
 */
/**
 * @attribute {String} [blocktype="function"]
 * the type of this display block. Accepted values: "function", "attribute"
 */
/**
 * @method render
 */
/**
 * @class docviewer.dividerline
 * @extends view
 */
/**
 * @class docviewer.ClassDocView
 * @extends view
 */
/**
 * @attribute {Boolean} collapsible
 * If collapsible is true, the render function will build a foldcontainer around this class. This is used for recursion levels > 0 of the docviewer class.
 */
/**
 * @attribute {Object} class_doc
 * the class_doc structure to display.
 */
/**
 * @method BuildGroup
 * @param inputarray
 * @param title
 * @param icon
 * @param color
 * @param blocktype
 */
/**
 * @method render
 */
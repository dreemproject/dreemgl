/**
 * @class album
 * @extends screen
 * An Album will display a simple list of image urls, or objects with `.image` url properties.
 */
/**
 * @attribute {String} [selection="undefined"]
 * The input for the selection control widget
 */
/**
 * @attribute {Object} [selecteditem="undefined"]
 * The currently selected item
 */
/**
 * @attribute {Array} [items="undefined"]
 * Items to display in the album (typically a list of image URLs, or structures with .image attributes)
 */
/**
 * @method onselection
 * Fired when selection controller has input ready to process
 * @param event
 */
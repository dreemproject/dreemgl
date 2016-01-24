/**
 * @class label
 * @extends view
 * A simple UI label for displaying text
 */
/**
 * @attribute {vec4} [fgcolor="1,1,1,1"]
 * the text color
 */
/**
 * @attribute {String} [text="text"]
 * The string to display.
 */
/**
 * @attribute {float32} [fontsize="18"]
 * Size of the font in pixels
 */
/**
 * @attribute {float32} boldness
 * the boldness of the font (try values 0 - 1)
 */
/**
 * @attribute {Object} font
 * reference to the font typeface, require it with require('font:')
 */
/**
 * @attribute {Boolean} multiline
 * Should the text wrap around when its width has been reached?
 */
/**
 * @attribute {Boolean} subpixel
 * turn on subpixel aa, this requieres a bgcolor to be present
 */
/**
 * @attribute {Enum} [align="left"]
 * Alignment of the bodytext.
 */
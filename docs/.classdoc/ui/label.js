/**
 * @class label
 * @extends view
 * A simple UI label for displaying text
 * <br/><a href="/examples/text">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/label.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/label.js">open example in new tab &raquo;</a>
 * 
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
 * @attribute {float32} [boldness="0"]
 * the boldness of the font (try values 0 - 1)
 */
/**
 * @attribute {float32} [linespacing="1"]
 * line spacing
 */
/**
 * @attribute {Object} [font="undefined"]
 * reference to the font typeface, require it with require('font:')
 */
/**
 * @attribute {Boolean} [multiline="false"]
 * Should the text wrap around when its width has been reached?
 */
/**
 * @attribute {Boolean} [subpixel="false"]
 * turn on subpixel aa, this requieres a bgcolor to be present
 */
/**
 * @attribute {Enum} [align="left"]
 * Alignment of the bodytext.
 */
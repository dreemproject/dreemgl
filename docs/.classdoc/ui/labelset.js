/**
 * @class labelset
 * @extends view
 * A simple UI label for displaying text
 * 
 * <iframe style="border:0;width:900px;height:300px" src="http://localhost:2000/apps/docs/example#path=$root/ui/labelset.js"></iframe>
 * <a target="blank" href="http://localhost:2000/apps/docs/example#path=$root/ui/labelset.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {vec4} [fgcolor="1,1,1,1"]
 * the text color
 */
/**
 * @attribute {Array} [labels=""]
 * The strings to display. Each array item should be in the form of {text:"somestring", pos:vec3(x,y,z), multiline:false}
 */
/**
 * @attribute {float32} [fontsize="18"]
 * Size of the font in pixels
 */
/**
 * @attribute {float32} [boldness="undefined"]
 * the boldness of the font (try values 0 - 1)
 */
/**
 * @attribute {Object} [font="undefined"]
 * reference to the font typeface, require it with require('font:')
 */
/**
 * @attribute {Boolean} [subpixel="undefined"]
 * turn on subpixel aa, this requieres a bgcolor to be present
 */
/**
 * @attribute {Enum} [align="left"]
 * Alignment of the bodytext.
 */
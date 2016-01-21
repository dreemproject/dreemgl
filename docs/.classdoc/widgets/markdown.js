/**
 * @class markdown
 * @extends view
 * Markdown display class - this element can display a small subset of the "markdown" syntax. See the SUPPORTED_MARKDOWN.md file in the docviewer for supported elements.
 */
/**
 * @attribute {Object} [body="[object Object]"]
 * Body can be a single string or an array of strings - each string will be its own paragraph.
 */
/**
 * @attribute {String} [align="left"]
 * alignment of the bodytext.
 * accepted values are "left", "right", "justify" and "center"
 */
/**
 * @attribute {Number} [fontsize="14"]
 * Base fontsize - heading sizes will be multiples of this value.
 */
/**
 * @attribute {vec4} [fontcolor="0.125490203499794,0.125490203499794,0.125490203499794,1"]
 * The color to use as the default color for this textblock.
 */
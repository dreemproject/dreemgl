/**
 * @class statebutton
 * @extends view
 * A button
 */
/**
 * @attribute {String} [image="undefined"]
 * Image that floats inside the button (as opposed to it's bgimage).
 */
/**
 * @attribute {vec4} [fgcolor="0.30000001192092896,0.30000001192092896,0.30000001192092896,1"]
 * Foreground color of any label or icon text.
 */
/**
 * @attribute {Object} [font="undefined"]
 * reference to the font typeface, require it with require('font:')
 */
/**
 * @attribute {float32} [fontsize="18"]
 * Size of the font in pixels
 */
/**
 * @attribute {boolean} [bold="true"]
 * Use a bold font on label
 */
/**
 * @attribute {float32} [boldness="undefined"]
 * The boldness of the label font (values 0 - 1)
 */
/**
 * @attribute {String} [label="undefined"]
 * Text to display in button's label.
 */
/**
 * @attribute {String} [text="undefined"]
 * deprecated
 */
/**
 * @attribute {String} [icon="undefined"]
 * Icon to display in button.
 */
/**
 * @attribute {Enum} [state="normal"]
 * Tab display state.  Changing this can have side effects if `on` functions are provided
 */
/**
 * @attribute {Object} [normal="undefined"]
 * Configuration for normal state
 */
/**
 * @attribute {Object} [active="undefined"]
 * Configuration for active/pressed state
 */
/**
 * @attribute {Object} [hover="undefined"]
 * Configuration for hover state
 */
/**
 * @attribute {Object} [selected="undefined"]
 * Configuration for selected state
 */
/**
 * @attribute {Object} [disabled="undefined"]
 * Configuration for disabled state
 */
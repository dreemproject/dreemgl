/**
 * @class checkbox
 * @extends view
 * Simple checkbox/tobble button: a rectangle with a textlabel and an icon
 * <br/><a href="/examples/checkboxes">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/checkbox.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/checkbox.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {String} [text=""]
 * The label for the button
 */
/**
 * @attribute {float32} [fontsize="14"]
 * Font size in device-pixels.
 */
/**
 * @attribute {vec4} [col1="0.250980406999588,0.250980406999588,0.250980406999588,1"]
 * Gradient color 1
 */
/**
 * @attribute {vec4} [col2="0.250980406999588,0.250980406999588,0.250980406999588,1"]
 * Gradient color 2
 */
/**
 * @attribute {vec4} [textcolor="0.250980406999588,0.250980406999588,0.250980406999588,1"]
 * Color of the label text in neutral state
 */
/**
 * @attribute {vec4} [textactivecolor="0,0.501960813999176,0,1"]
 * Color of the label text in pressed-down state
 */
/**
 * @attribute {vec4} [buttoncolor1="1,1,0.9411764740943909,1"]
 * First gradient color for the button background in neutral state
 */
/**
 * @attribute {vec4} [buttoncolor2="1,1,1,1"]
 * Second gradient color for the button background in neutral state
 */
/**
 * @attribute {vec4} [hovercolor1="0.9411764740943909,0.9411764740943909,0.9411764740943909,1"]
 * First gradient color for the button background in hovered state
 */
/**
 * @attribute {vec4} [hovercolor2="0.9725490212440491,0.9725490212440491,0.9725490212440491,1"]
 * Second gradient color for the button background in hovered state
 */
/**
 * @attribute {vec4} [pressedcolor1="0.8156862854957581,0.8156862854957581,0.9411764740943909,1"]
 * First gradient color for the button background in pressed state
 */
/**
 * @attribute {vec4} [pressedcolor2="0.8156862854957581,0.8156862854957581,0.9411764740943909,1"]
 * Second gradient color for the button background in pressed state
 */
/**
 * @method statehover
 * the hover state when someone hovers over the button
 */
/**
 * @method statenormal
 * the normal button state
 */
/**
 * @method stateclick
 * clicked state
 */
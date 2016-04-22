/**
 * @class button
 * @extends view
 * Simple gradient button: a rectangle with a textlabel and an icon
 * <br/><a href="/examples/buttons">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/button.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/button.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {String} [text=""]
 * The label for the button
 */
/**
 * @attribute {String} [icon=""]
 * The icon for the button, see FontAwesome for the available icon-names.
 */
/**
 * @attribute {float32} [fontsize="14"]
 * Font size in device-pixels.
 */
/**
 * @attribute {vec4} [col1="0.15294118225574493,0.15294118225574493,0.15294118225574493,1"]
 * Gradient color 1
 */
/**
 * @attribute {vec4} [col2="0.15294118225574493,0.15294118225574493,0.15294118225574493,1"]
 * Gradient color 2
 */
/**
 * @attribute {vec4} [textcolor="1,1,1,1"]
 * Color of the label text in neutral state
 */
/**
 * @attribute {vec4} [textactivecolor="1,1,1,1"]
 * Color of the label text in pressed-down state
 */
/**
 * @attribute {vec4} [buttoncolor1="0.38823530077934265,0.38823530077934265,0.38823530077934265,1"]
 * First gradient color for the button background in neutral state
 */
/**
 * @attribute {vec4} [buttoncolor2="0.38823530077934265,0.38823530077934265,0.38823530077934265,1"]
 * Second gradient color for the button background in neutral state
 */
/**
 * @attribute {vec4} [hovercolor1="0.772549033164978,0.772549033164978,0.772549033164978,1"]
 * First gradient color for the button background in hovered state
 */
/**
 * @attribute {vec4} [hovercolor2="0.4745098054409027,0.4745098054409027,0.4745098054409027,1"]
 * Second gradient color for the button background in hovered state
 */
/**
 * @attribute {vec4} [pressedcolor1="0.43921568989753723,0.43921568989753723,0.43921568989753723,1"]
 * First gradient color for the button background in pressed state
 */
/**
 * @attribute {vec4} [pressedcolor2="0.43921568989753723,0.43921568989753723,0.43921568989753723,1"]
 * Second gradient color for the button background in pressed state
 */
/**
 * @attribute {vec4} [internalmargin="0,0,0,0"]
 * Second gradient color for the button background in pressed state
 */
/**
 * @attribute {boolean} [enabled="true"]
 * bold: true,
 */
/**
 * @method bgcolorfn
 * Set the background
 * @param {vec2} pos
 * position
 */
/**
 * @method statehover
 * the hover state when someone hovers over the button
 */
/**
 * @method statenormal
 * the normal button state
 * @param first
 */
/**
 * @method stateclick
 * clicked state
 */
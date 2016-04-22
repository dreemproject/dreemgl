/**
 * @class radiobutton
 * @extends button
 * Similar to a button, but carries a `group` and a selection state, and only one `radiobutton` per group can be seelcted at any one time.
 * <br/><a href="/examples/buttons">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/radiobutton.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/radiobutton.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {String} [group="default"]
 * The radiobutton group.  Only one button per group can be selected at any one time.  Radio buttons without a specificed group all share a default group.
 */
/**
 * @attribute {boolean} [selected="false"]
 * The current seelction state of the button
 */
/**
 * @attribute {vec4} [textselectedcolor="1,1,0,1"]
 * Color of the label text in pressed-down state
 */
/**
 * @attribute {vec4} [selectedcolor1="0.5333333611488342,0.5333333611488342,0.5333333611488342,1"]
 * First gradient color for the button background in selected state
 */
/**
 * @attribute {vec4} [selectedcolor2="0.6666666865348816,0.6666666865348816,0.6666666865348816,1"]
 * Second gradient color for the button background in selected state
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
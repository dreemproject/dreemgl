/**
 * @class splitcontainer
 * @extends view
 * splitcontainer adds dragbars between nodes to make all the nodes resizable. 
 */
/**
 * @attribute {Enum} [direction="vertical"]
 * wether the splitcontainer is vertical or not
 */
/**
 * @attribute {float32} [splitsize="6"]
 * set the width (or height) of the splitter bar
 */
/**
 * @attribute {float32} [minimalchildsize="20"]
 * the minimum size of a child controlled by the splitter
 */
/**
 * @attribute {vec4} [splittercolor="0.2823529541492462,0.2823529541492462,0.2823529541492462,1"]
 * the color of the splitter bar
 */
/**
 * @attribute {vec4} [hovercolor="0.43921568989753723,0.43921568989753723,0.43921568989753723,1"]
 * color of splitter bar on hover
 */
/**
 * @attribute {vec4} [activecolor="0.43921568989753723,0.43921568989753723,0.6274510025978088,1"]
 * color of the splitter bar when dragging it
 */
/**
 * @method direction
 */
/**
 * @method render
 */
/**
 * @class splitcontainer.splitter
 * @extends view
 * the visual class that defines the draggable bar between the resizable children
 */
/**
 * @attribute {int32} firstnode
 */
/**
 * @attribute {Boolean} vertical
 */
/**
 * @attribute {float32} [splitsize="6"]
 */
/**
 * @attribute {vec4} [splittercolor="0.250980406999588,0.250980406999588,0.3137255012989044,1"]
 */
/**
 * @attribute {vec4} [hovercolor="0.9411764740943909,0.3137255012989044,0.6274510025978088,1"]
 */
/**
 * @attribute {vec4} [bgcolor="1,1,1,1"]
 */
/**
 * @attribute {vec4} [activecolor="0.43921568989753723,0.43921568989753723,0.6274510025978088,1"]
 */
/**
 * @method mouseover
 */
/**
 * @method mouseout
 */
/**
 * @method mouseleftdown
 * @param event
 */
/**
 * @method mouseleftup
 */
/**
 * @method vertical
 */
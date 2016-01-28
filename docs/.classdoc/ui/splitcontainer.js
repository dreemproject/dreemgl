/**
 * @class splitcontainer
 * @extends view
 * Splitcontainer adds dragbars between nodes to make all the nodes resizable.
 * 
 * <iframe style="border-radius:7px;border-style:dashed;border-width:thin;width:900px;height:500px" src="http://localhost:2000/apps/docs/example#path=$root/ui/splitcontainer.js"></iframe>
 * 
 */
/**
 * @attribute {Enum} [direction="vertical"]
 * wether the splitcontainer is vertical or not
 */
/**
 * @attribute {float32} [splitsize="8"]
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
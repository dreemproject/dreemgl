/**
 * @class tabbar
 * @extends view
 * Presents a bar of configurable tabs
 * 
 * <iframe style="border:0;width:900px;height:600px" src="http://localhost:2000/apps/docs/example#path=$root/ui/tabbar.js"></iframe>
 * <a target="blank" href="http://localhost:2000/apps/docs/example#path=$root/ui/tabbar.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {Array} [tabs=""]
 * Tab definitions.  This can be a simple list of strings or and array of more complicated
 * objects that describe tab behavior in detail.
 */
/**
 * @attribute {vec4} [tabcolor="0,0,0,1"]
 * Color of default tabs, can be overridden in style
 */
/**
 * @attribute {Object} [selection="undefined"]
 * Current tab selection
 */
/**
 * @attribute {Object} [states="[object Object]"]
 * Default tab states if none provided in the tab defintions.
 */
/**
 * @class drawer
 * @extends view
 * A drawer view that slides to reveal trays either to the left and right in horizontal mode or or the top and
 * bottom in vertical mode.  Subviews can contain components which will become activated as the lower tray is revealed.
 * Up to three subviews can be added to the drawer's constructor, providing the top drawer view, the right tray view
 * and the left tray view, in that order.
 * <br/><a href="/examples/drawers">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/drawer.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/drawer.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {Enum} [direction="horizontal"]
 * The orientation of the drawers, ether left/right or top/bottom
 */
/**
 * @attribute {float32} [value="0"]
 * The relative offset of the top drawer view to the center, a value between (far left) -1.0 ~ 1.0 (far right),
 * with 0 being exactly at the center.
 */
/**
 * @attribute {float32} [min="-0.5"]
 * The threshold value at which to allow the drawer to open and lock the right tray
 */
/**
 * @attribute {float32} [max="0.5"]
 * The threshold value at which to allow the drawer to open and lock the left tray
 */
/**
 * @class toolkit
 * @extends view
 * The DreemGL Visual Toolkit allows for visual manipulation of a running composition
 * <br/><a href="/examples/usingtoolkit">examples &raquo;</a>
 */
/**
 * @attribute {Object} [inspect="undefined"]
 * The target for the property inspector
 */
/**
 * @attribute {Object} [components="[object Object]"]
 * Components available to be dragged into compositions.
 */
/**
 * @attribute {Enum} [mode="design"]
 * When in 'design' mode buttons in compositions no longer become clickable, text fields become immutable,
 * and views can be resized and manipulated.  In 'live' mode views lock into place the composition regains
 * it's active behaviors
 */
/**
 * @attribute {Enum} [dropmode="absolute"]
 * Should views be dropped as absolute or relative children
 */
/**
 * @attribute {float32} [reticlesize="9"]
 * The size of the reticle hot corners inside of a view
 */
/**
 * @attribute {boolean} [groupdrag="true"]
 * When dragging multiple selections, `groupdrag:true` will result in all selected views dragging together
 * whereas `groupdrag:false` will only move the view under the cursor
 */
/**
 * @attribute {boolean} [groupreparent="false"]
 * When dropping a multiple selection into a view, should all views be reparented into the view that the
 * mouse is over, or should they drop exactly where they are physically locate don the canvas.
 */
/**
 * @attribute {boolean} [rulers="true"]
 * Show or hide the rules when selecting and dragging
 */
/**
 * @attribute {boolean} [handles="true"]
 * Show or hide the rotatation handle
 */
/**
 * @attribute {boolean} [guides="true"]
 * Show guide bars
 */
/**
 * @attribute {boolean} [snap="true"]
 * Snap to guides
 */
/**
 * @attribute {boolean} [movelines="true"]
 * Show guidelines when moving
 */
/**
 * @attribute {boolean} [hoverlines="false"]
 * Always center guideline crosshairs on the mouse cursor
 */
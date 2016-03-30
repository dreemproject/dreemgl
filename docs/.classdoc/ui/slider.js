/**
 * @class slider
 * @extends view
 * Slider with customizable handle.  To customize the handle put views as the slider's constructor children.
 * <br/><a href="/examples/sliders">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:600px" src="/apps/docs/example#path=$root/ui/slider.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$root/ui/slider.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {vec4} [fgcolor="black"]
 * The color for the value bar in the slider
 */
/**
 * @attribute {float32} [value="0.5"]
 * The current value, between 0.0 ~ 1.0
 */
/**
 * @attribute {float32} [step="undefined"]
 * The size of each step between 0 ~ 1, e.g. 0.01 would create 100 discrete steps.  The value of 0 indicates a continuum.
 */
/**
 * @attribute {float32} [minvalue="undefined"]
 * Minimum value allowed, for restricting slider range
 */
/**
 * @attribute {float32} [maxvalue="1"]
 * Maximum value allowed, for restricting slider range
 */
/**
 * @attribute {boolean} [horizontal="true"]
 * Horizontal or vertical arrangement
 */
/**
 * @attribute {float32} [minhandlethreshold="10"]
 * Threshold at which to draw a handle if none is provided in the constructor.
 */
/**
 * @attribute {boolean} [smooth="true"]
 * Smoothly mix the background/foreground color or draw a hard edge
 */
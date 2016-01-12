/**
 * @class colorpicker
 * @extends view
 */
/**
 * @attribute {vec4} [value="white"]
 * the value of the colorpicker, a color
 */
/**
 * @attribute {int32} [fontsize="14"]
 * the foreground color of the fonts
 */
/**
 * @attribute {vec4} [internalbordercolor="1,1,1,0.6000000238418579"]
 * internal border color
 */
/**
 * @attribute {float32} [basehue="0.5"]
 * read-only the hue value (HSV)
 */
/**
 * @attribute {float32} [basesat="0.8"]
 * read-only the saturation value (HSV)
 */
/**
 * @attribute {float32} [baseval="0.5"]
 * read-only, the value (HSV)
 */
/**
 * @attribute {float32} [sliderheight="15"]
 */
/**
 * @method internalbordercolor
 */
/**
 * @method updatecontrol
 * @param name
 * @param val
 */
/**
 * @method updatelabel
 * @param name
 * @param val
 */
/**
 * @method numbertohex
 * @param num
 */
/**
 * @method buildhexnumber
 * @param vector
 */
/**
 * @method updateallcontrols
 */
/**
 * @method value
 */
/**
 * @method createColorFromHSV
 */
/**
 * @method createHSVFromColor
 */
/**
 * @method setRed
 * @param r
 */
/**
 * @method setGreen
 * @param g
 */
/**
 * @method setBlue
 * @param b
 */
/**
 * @method setHueBase
 * @param h
 */
/**
 * @method setSatBase
 * @param s
 */
/**
 * @method setLumBase
 * @param s
 */
/**
 * @method layout
 */
/**
 * @method render
 */
/**
 * @class colorpicker.customslider
 * @extends view
 */
/**
 * @attribute {vec3} [hsvfrom="0,1,0.5"]
 * hsv color for the left side
 */
/**
 * @attribute {vec3} [hsvto="1,1,0.5"]
 * hsv color for the right side
 */
/**
 * @attribute {float32} hsvhueadd
 */
/**
 * @attribute {float32} basehue
 */
/**
 * @attribute {vec4} [currentcolor="1,0,0,1"]
 */
/**
 * @attribute {vec4} [contrastcolor="1,1,1,1"]
 */
/**
 * @attribute {vec4} [draggercolor="1,1,1,0.800000011920929"]
 * Color of the draggable part of the scrollbar
 */
/**
 * @attribute {float32} [draggerradius="3"]
 * Color of the draggable part of the scrollbar
 */
/**
 * @attribute {vec4} [hovercolor="0.501960813999176,0.501960813999176,0.7529411911964417,1"]
 * Color when the mouse is hovering over the draggable part of the scrollbar
 */
/**
 * @attribute {vec4} [activecolor="0.501960813999176,0.501960813999176,0.7529411911964417,1"]
 * Color of the draggable part of the scrollbar while actively scrolling
 */
/**
 * @attribute {Boolean} vertical
 * Is this a horizontal or a vertical scrollbar?
 */
/**
 * @attribute {float32} offset
 * Current start offset of the scrollbar. Ranges from 0 to total - page
 */
/**
 * @attribute {float32} [page="25"]
 * Page size, in total
 */
/**
 * @attribute {float32} [total="280"]
 * total size.
 */
/**
 * @attribute {vec4} [bgcolor="1,1,1,1"]
 * set animation on bgcolor
 */
/**
 * @method page
 */
/**
 * @method offset
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
 * @class colorpicker.colorcirclecontrol
 * @extends view
 */
/**
 * @attribute {float32} [ringwidth="0.3"]
 */
/**
 * @attribute {float32} hover
 */
/**
 * @attribute {float32} [basehue="0.7"]
 */
/**
 * @attribute {float32} [basesat="0.7"]
 */
/**
 * @attribute {float32} [baseval="0.7"]
 */
/**
 * @attribute {vec4} [currentcolor="white"]
 */
/**
 * @attribute {vec4} [contrastcolor="1,1,1,1"]
 */
/**
 * @attribute {float32} [draggersize="8"]
 */
/**
 * @method updatehue
 * @param mousepos
 */
/**
 * @method mouseleftdown
 * @param event
 */
/**
 * @method mouseleftup
 */
/**
 * @method mouseout
 */
/**
 * @method mouseover
 */
/**
 * @method bg
 */
/**
 * @class colorpicker.colorcirclecontrol.fg
 * @extends shaderwebgl
 */
/**
 * @method update
 */
/**
 * @method position
 */
/**
 * @method color
 */
/**
 * @class colorpicker.squareview
 * @extends view
 */
/**
 * @attribute {float32} [basehue="0.7"]
 */
/**
 * @attribute {float32} [basesat="0.7"]
 */
/**
 * @attribute {float32} [baseval="0.7"]
 */
/**
 * @attribute {vec4} [currentcolor="white"]
 */
/**
 * @attribute {vec4} [contrastcolor="1,1,1,1"]
 */
/**
 * @attribute {float32} [draggersize="8"]
 */
/**
 * @attribute {float32} [hover="1"]
 */
/**
 * @method updatecolorfrommouse
 * @param p
 */
/**
 * @method mouseleftdown
 * @param p
 */
/**
 * @method mouseleftup
 */
/**
 * @class colorpicker.squareview.fg
 * @extends shaderwebgl
 */
/**
 * @method update
 */
/**
 * @method position
 */
/**
 * @method color
 */
/**
 * @class colorpicker.squareview.bg
 * @extends shaderwebgl
 */
/**
 * @method position
 */
/**
 * @method color
 */
/**
 * @method update
 */
/**
 * @class colorpicker.colorarea
 * @extends view
 */
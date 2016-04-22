/**
 * @class view
 * @extends node
 * Base UI view object
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/view.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/view.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {boolean} [visible="true"]
 * wether to draw it
 */
/**
 * @attribute {vec3} [pos="0,0,0"]
 * pos(ition) of the view, relative to parent. For 2D only the first 2 components are used, for 3D all three.
 */
/**
 * @attribute {typeless} [x="undefined"]
 * alias for the x component of pos
 */
/**
 * @attribute {typeless} [y="undefined"]
 * alias for the y component of pos
 */
/**
 * @attribute {typeless} [z="undefined"]
 * alias for the z component of pos
 */
/**
 * @attribute {typeless} [left="undefined"]
 * alias for the x component of pos
 */
/**
 * @attribute {typeless} [top="undefined"]
 * alias for the y component of pos
 */
/**
 * @attribute {typeless} [front="undefined"]
 * alias for the z component of pos
 */
/**
 * @attribute {vec3} [corner="NaN,NaN,NaN"]
 * the bottom/right/rear corner, used by layout
 */
/**
 * @attribute {typeless} [right="undefined"]
 * alias for the x component of corner
 */
/**
 * @attribute {typeless} [bottom="undefined"]
 * alias for  y component of corner
 */
/**
 * @attribute {typeless} [rear="undefined"]
 * alias for z component of corner
 */
/**
 * @attribute {vec4} [bgcolor="0,0,0,0"]
 * the background color of a view, referenced by various shaders
 */
/**
 * @attribute {Object} [bgimage="undefined"]
 * the background image of a view. Accepts a string-url or can be assigned a require('./mypic.png')
 */
/**
 * @attribute {float32} [opacity="1"]
 * the opacity of the image
 */
/**
 * @attribute {vec4} [colorfilter="1,1,1,1"]
 * Per channel color filter, each color is a value in the range 0.0 ~ 1.0 and is multiplied by the color of the background image
 */
/**
 * @attribute {Enum} [bgimagemode="stretch"]
 * Image mode alters how/where the background image is scaled, streched, fit and drawn within the view's bounds.
 */
/**
 * @attribute {vec2} [bgimageoffset="0,0"]
 * Offets the image within the view.  This value is in texture coordinates.
 */
/**
 * @attribute {Enum} [bgimagealign="none"]
 * When using `aspect-fit`, or `apsect-fill` this property will automatically adjust the image's location within the view.
 */
/**
 * @attribute {vec4} [clearcolor="NaN"]
 * the clear color of the view when it is in '2D' or '3D' viewport mode
 */
/**
 * @attribute {vec2} [scroll="0,0"]
 * the scroll position of the view matrix, allows to scroll/move items in a viewport. Only works on a viewport:'2D'
 * this property is manipulated by the overflow:'SCROLL' scrollbars
 */
/**
 * @attribute {float32} [zoom="1"]
 * the zoom factor of the view matrix, allows zooming of items in a viewport. Only works on viewport:'2D'
 */
/**
 * @attribute {Enum} [overflow=""]
 * overflow control, shows scrollbars when the content is larger than the viewport. If any value is set, it defaults to viewport:'2D'
 * works the same way as the CSS property
 */
/**
 * @attribute {vec3} [size="NaN,NaN,NaN"]
 * size, this holds the width/height/depth of the view. When set to NaN it means the layout engine calculates the size
 */
/**
 * @attribute {typeless} [width="undefined"]
 * alias for the x component of size
 */
/**
 * @attribute {typeless} [height="undefined"]
 * alias for the y component of size
 */
/**
 * @attribute {typeless} [depth="undefined"]
 * alias for the z component of size
 */
/**
 * @attribute {typeless} [percentwidth="undefined"]
 * alias for the x component of percentsize
 */
/**
 * @attribute {typeless} [percentheight="undefined"]
 * alias for the y component of percentsize
 */
/**
 * @attribute {typeless} [percentdepth="undefined"]
 * alias for the z component of percentsize
 */
/**
 * @attribute {float32} [pixelratio="NaN"]
 * the pixelratio of a viewport. Allows scaling the texture buffer to arbitrary resolutions. Defaults to the system (low/high DPI)
 */
/**
 * @attribute {vec3} [minsize="NaN,NaN,NaN"]
 * the minimum size for the flexbox layout engine
 */
/**
 * @attribute {vec3} [maxsize="NaN,NaN,NaN"]
 * the maximum size for the flexbox layout engine
 */
/**
 * @attribute {typeless} [minwidth="undefined"]
 * alias for the x component of minsize
 */
/**
 * @attribute {typeless} [minheight="undefined"]
 * alias for the y component of minsize
 */
/**
 * @attribute {typeless} [mindepth="undefined"]
 * alias for the z component of minsize
 */
/**
 * @attribute {typeless} [maxwidth="undefined"]
 * alias for the x component of maxsize
 */
/**
 * @attribute {typeless} [maxheight="undefined"]
 * alias for the y component of maxsize
 */
/**
 * @attribute {typeless} [maxdepth="undefined"]
 * alias for the z component of maxsize
 */
/**
 * @attribute {vec4} [margin="0,0,0,0"]
 * the margin on 4 sides of the box (left, top, right, bottom). Can be assigned a single value to set them all at once
 */
/**
 * @attribute {typeless} [marginleft="undefined"]
 * alias for the first component of margin
 */
/**
 * @attribute {typeless} [margintop="undefined"]
 * alias for the second component of margin
 */
/**
 * @attribute {typeless} [marginright="undefined"]
 * alias for the third component of margin
 */
/**
 * @attribute {typeless} [marginbottom="undefined"]
 * alias for the fourth component of margin
 */
/**
 * @attribute {vec4} [padding="0,0,0,0"]
 * the padding on 4 sides of the box (left, top, right, bottom) Can be assigned a single value to set them all at once
 */
/**
 * @attribute {typeless} [paddingleft="undefined"]
 * alias for the first component of padding
 */
/**
 * @attribute {typeless} [paddingtop="undefined"]
 * alias for the second component of padding
 */
/**
 * @attribute {typeless} [paddingright="undefined"]
 * alias for the third component of padding
 */
/**
 * @attribute {typeless} [paddingbottom="undefined"]
 * alias for the fourth component of padding
 */
/**
 * @attribute {vec3} [scale="1,1,1"]
 * Scale of an item, only useful for items belof a 3D viewport
 */
/**
 * @attribute {vec3} [anchor="0,0,0"]
 * The anchor point around which items scale and rotate, depending on anchor mode its either a factor of size or and absolute value
 */
/**
 * @attribute {Enum} [anchormode="factor"]
 * the mode with which the anchor is computed. Factor uses the size of an item to find the point, defaulting to center
 */
/**
 * @attribute {vec3} [rotate="0,0,0"]
 * rotate the item around x, y or z in radians. If you want degrees type it like this: 90*DEG
 */
/**
 * @attribute {vec4} [bordercolor="0,0,0,0"]
 * the color of the border of an item.
 */
/**
 * @attribute {vec4} [borderradius="0,0,0,0"]
 * the radius of the corners of an item, individually settable left, top, right, bottom. Setting this value will switch to rounded corner shaders
 */
/**
 * @attribute {vec4} [borderwidth="0,0,0,0"]
 * the width of the border. Setting this value will automatically enable the border shaders
 */
/**
 * @attribute {typeless} [borderleftwidth="undefined"]
 * alias for the first component of borderwidth
 */
/**
 * @attribute {typeless} [bordertopwidth="undefined"]
 * alias for the second component of borderwith
 */
/**
 * @attribute {typeless} [borderrightwidth="undefined"]
 * alias for the third component of borderwith
 */
/**
 * @attribute {typeless} [borderbottomwidth="undefined"]
 * alias for the fourth component of borderwith
 */
/**
 * @attribute {float32} [flex="NaN"]
 * turn on flex sizing. Flex is a factor that distributes either the widths or the heights of nodes by this factor
 * flexbox layout is a web standard and has many great tutorials online to learn how it works
 */
/**
 * @attribute {Enum} [flexwrap="wrap"]
 * wraps nodes around when the flexspace is full
 */
/**
 * @attribute {Enum} [flexdirection="row"]
 * which direction the flex layout is working,
 */
/**
 * @attribute {Enum} [justifycontent=""]
 * pushes items eitehr to the start, center or end
 */
/**
 * @attribute {Enum} [alignitems="stretch"]
 * align items to either start, center, end or stretch them
 */
/**
 * @attribute {Enum} [alignself=""]
 * overrides the parents alignitems with our own preference
 */
/**
 * @attribute {Enum} [position="relative"]
 * item positioning, if absolute it steps 'outside' the normal flex layout
 */
/**
 * @attribute {Object} [layout="[object Object]"]
 * the layout object, contains width/height/top/left after computing. Its a read-only property and should be used in shaders only.
 * Can be listened to to observe layout changes
 */
/**
 * @attribute {Enum} [viewport=""]
 * When set to 2D or 3D the render engine will create a separate texture pass for this view and all its children
 * using a 2D viewport is a great way to optimize render performance as when nothing changes, none of the childstructures
 * need to be processed and a single texture can just be drawn by the parent
 * the viewportblend shader can be used to render this texture it into its parent
 */
/**
 * @attribute {float32} [fov="45"]
 * the field of view of a 3D viewport. Only useful on a viewport:'3D'
 */
/**
 * @attribute {float32} [nearplane="0.001"]
 * the nearplane of a 3D viewport, controls at which Z value near clipping start. Only useful on a viewport:'3D'
 */
/**
 * @attribute {float32} [farplane="1000"]
 * the farplane of a 3D viewport, controls at which Z value far clipping start. Only useful on a viewport:'3D'
 */
/**
 * @attribute {vec3} [camera="-2,2,-2"]
 * the position of the camera in 3D space. Only useful on a viewport:'3D'
 */
/**
 * @attribute {vec3} [lookat="0,0,0"]
 * the point the camera is looking at in 3D space. Only useful on a viewport:'3D'
 */
/**
 * @attribute {vec3} [up="0,-1,0"]
 * the up vector of the camera (which way is up for the camera). Only useful on a viewport:'3D'
 */
/**
 * @attribute {float32} [dropshadowradius="20"]
 * drop shadow size
 */
/**
 * @attribute {vec2} [dropshadowoffset="0,0"]
 * drop shadow movement
 */
/**
 * @attribute {float32} [dropshadowhardness="0.5"]
 * drop shadow hardness
 */
/**
 * @attribute {float32} [dropshadowopacity="0"]
 * drop shadow opacity
 */
/**
 * @attribute {vec4} [dropshadowcolor="0,0,0,1"]
 * drop shadow color
 */
/**
 * @attribute {boolean} [focus="false"]
 * whether this view has focus
 */
/**
 * @attribute {float32} [tabstop="NaN"]
 * tabstop, sorted by number
 */
/**
 * @attribute {Enum} [cursor=""]
 * the type of pointer cursor to use for this view
 */
/**
 * @attribute {int32} [passes="0"]
 * The number of render passes for this view. Note that corresponding
 * inner classes will need to be created for multi pass rendering to work,
 * see /classes/ui/blurtest.js for an example.
 */
/**
 * @method atViewDestroy
 * lets destroy some shaders/vertexbuffers
 */
/**
 * @method setBgImage
 * image can be an image, or a Texture (has array property).
 * @param image
 */
/**
 * @method globalToLocal
 * Internal: remap the x and y coordinates to local space
 * @param value
 */
/**
 * @method startDrag
 * starts a drag view via render function
 * @param pointerevent
 * @param render
 */
/**
 * @method animate
 * Animates an attribute over time.
 * Returns a promise that resolves when the animation completes. This allows animations
 * to be chained together, or other behaviors to occur when an animation ends.
 * @param {String} attribute
 * The name of the attribute to animate on this view.
 * @param {Object} track
 * An object consisting of keys with time offset (in seconds)/value pairs. Each value can be discrete, or an object with motion and value keys where motion describes the interpolation from the previous value to this one, and value describes the value to animate to.
 */
/**
 * @method stopAnimation
 * Stops a running animation for an attribute
 * @param {String} attribute
 * The name of the attribute to stop animating on this view.
 */
/**
 * @method bgcolorfn
 * Determines the background color that should be drawn at a given position.
 * Returns a vec4 color value, defaults to bgcolor.
 * @param pos
 * vec2
 */
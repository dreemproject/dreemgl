/**
 * @class view
 * @extends node
 */
/**
 * @attribute {boolean} [visible="true"]
 * a simple boolean to turn visibility of a node on or off
 */
/**
 * @attribute {vec3} [pos="0,0,0"]
 * pos(ition) of the view, relative to parent. For 2D only the first 2 components are used, for 3D all three.
 */
/**
 * @attribute {typeless} x
 * alias for the x component of pos
 */
/**
 * @attribute {typeless} y
 * alias for the y component of pos
 */
/**
 * @attribute {typeless} z
 * alias for the z component of pos
 */
/**
 * @attribute {typeless} left
 * alias for the x component of pos
 */
/**
 * @attribute {typeless} top
 * alias for the y component of pos
 */
/**
 * @attribute {typeless} front
 * alias for the z component of pos
 */
/**
 * @attribute {vec3} [corner="NaN,NaN,NaN"]
 * the bottom/right/rear corner
 */
/**
 * @attribute {typeless} right
 * alias for the x component of corner
 */
/**
 * @attribute {typeless} bottom
 * alias for  y component of corner
 */
/**
 * @attribute {typeless} rear
 * alias for z component of corner
 */
/**
 * @attribute {vec4} [bgcolor="1,1,1,1"]
 * the background color of a view, referenced by various shaders
 */
/**
 * @attribute {Object} bgimage
 * the background image of a view. Accepts a string-url or can be assigned a require('./mypic.png')
 */
/**
 * @attribute {float32} [opacity="1"]
 * the opacity of the image
 */
/**
 * @attribute {vec4} [clearcolor="0,0,0,0"]
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
 * @attribute {Enum} overflow
 * overflow control, shows scrollbars when the content is larger than the viewport. If any value is set, it defaults to viewport:'2D'
 * works the same way as the CSS property
 */
/**
 * @attribute {vec3} [size="NaN,NaN,NaN"]
 * size, this holds the width/height/depth of the view. When set to NaN it means the layout engine calculates the size
 */
/**
 * @attribute {typeless} w
 * alias for the x component of size
 */
/**
 * @attribute {typeless} h
 * alias for the y component of size
 */
/**
 * @attribute {typeless} d
 * alias for the z component of size
 */
/**
 * @attribute {typeless} width
 * alias for the x component of size
 */
/**
 * @attribute {typeless} height
 * alias for the y component of size
 */
/**
 * @attribute {typeless} depth
 * alias for the z component of size
 */
/**
 * @attribute {float32} pixelratio
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
 * @attribute {typeless} minwidth
 * alias for the x component of minsize
 */
/**
 * @attribute {typeless} minheight
 * alias for the y component of minsize
 */
/**
 * @attribute {typeless} mindepth
 * alias for the z component of minsize
 */
/**
 * @attribute {typeless} maxwidth
 * alias for the x component of maxsize
 */
/**
 * @attribute {typeless} maxheight
 * alias for the y component of maxsize
 */
/**
 * @attribute {typeless} maxdepth
 * alias for the z component of maxsize
 */
/**
 * @attribute {vec4} [margin="0,0,0,0"]
 * the margin on 4 sides of the box (left, top, right, bottom). Can be assigned a single value to set them all at once
 */
/**
 * @attribute {typeless} marginleft
 * alias for the first component of margin
 */
/**
 * @attribute {typeless} margintop
 * alias for the second component of margin
 */
/**
 * @attribute {typeless} marginright
 * alias for the third component of margin
 */
/**
 * @attribute {typeless} marginbottom
 * alias for the fourth component of margin
 */
/**
 * @attribute {vec4} [padding="0,0,0,0"]
 * the padding on 4 sides of the box (left, top, right, bottom) Can be assigned a single value to set them all at once
 */
/**
 * @attribute {typeless} paddingleft
 * alias for the first component of padding
 */
/**
 * @attribute {typeless} paddingtop
 * alias for the second component of padding
 */
/**
 * @attribute {typeless} paddingright
 * alias for the third component of padding
 */
/**
 * @attribute {typeless} paddingbottom
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
 * @attribute {typeless} borderleftwidth
 * alias for the first component of borderwidth
 */
/**
 * @attribute {typeless} bordertopwidth
 * alias for the second component of borderwith
 */
/**
 * @attribute {typeless} borderrightwidth
 * alias for the third component of borderwith
 */
/**
 * @attribute {typeless} borderbottomwidth
 * alias for the fourth component of borderwith
 */
/**
 * @attribute {float32} flex
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
 * @attribute {Enum} justifycontent
 * pushes items eitehr to the start, center or end
 */
/**
 * @attribute {Enum} [alignitems="stretch"]
 * align items to either start, center, end or stretch them
 */
/**
 * @attribute {Enum} [alignself="stretch"]
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
 * @attribute {Enum} viewport
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
 * @attribute {float32} time
 * the current time which can be used in shaders to create continous animations
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
 * @attribute {float32} dropshadowopacity
 * drop shadow opacity
 */
/**
 * @attribute {vec4} [dropshadowcolor="0,0,0,1"]
 * drop shadow color
 */
/**
 * @attribute {boolean} focus
 */
/**
 * @attribute {float32} tabstop
 * tabstop, sorted by number
 */
/**
 * @attribute {Enum} cursor
 */
/**
 * @method ondropshadowradius
 * @param event
 */
/**
 * @method onborderradius
 * listen to switch the shaders when borderradius changes
 * @param event
 */
/**
 * @method onborderwidth
 * @param event
 */
/**
 * @method setBorderShaders
 */
/**
 * @method onviewport
 * listen to the viewport to turn off our background and border shaders when 3D
 * @param event
 */
/**
 * @method onoverflow
 * automatically turn a viewport:'2D' on when we  have an overflow (scrollbars) set
 */
/**
 * @method onfocus
 * setting focus to true
 * @param event
 */
/**
 * @method ontabstop
 * put a tablistener
 * @param event
 */
/**
 * @method localMouse
 * returns the mouse in local coordinates
 */
/**
 * @method oninit
 * initialization of a view
 * @param prev
 */
/**
 * @method onbgimage
 */
/**
 * @method setBgImage
 * @param image
 */
/**
 * @method emitUpward
 * emit an event upward (to all parents) untill a listener is hit
 * @param key
 * @param msg
 */
/**
 * @method findEmitUpward
 * @param key
 */
/**
 * @method computeCursor
 */
/**
 * @method atDraw
 * called at every frame draw
 */
/**
 * @method atInnerClassAssign
 * custom hook in the inner class assignment to handle nested shaders specifically
 * @param key
 * @param value
 */
/**
 * @method redraw
 * redraw our view and bubble up the viewport dirtiness to the root
 */
/**
 * @method reupdate
 * updates all the shaders
 */
/**
 * @method getViewGuid
 */
/**
 * @method updateShaders
 * this gets called by the render engine
 */
/**
 * @method atRender
 * decide to inject scrollbars into our childarray
 */
/**
 * @method updateScrollbars
 * show/hide scrollbars
 */
/**
 * @method updateMatrices
 * called by doLayout, to update the matrices to layout and parent matrix
 * @param parentmatrix
 * @param parentviewport
 * @param parent_changed
 * @param boundsinput
 * @param bailbound
 */
/**
 * @method relayoutRecur
 * @param source
 */
/**
 * @method relayout
 * @param shallow
 */
/**
 * @method rematrix
 */
/**
 * @method pos
 * moving a position in absolute should only trigger a matrix reload
 */
/**
 * @method doLayout
 * called by the render engine
 */
/**
 * @method startAnimation
 * @param key
 * @param value
 * @param track
 * @param resolve
 */
/**
 * @method stopAnimation
 * @param key
 */
/**
 * @method playAnimation
 * @param key
 */
/**
 * @method pauseAnimation
 * @param key
 */
/**
 * @method bgcolorfn
 * @param pos
 */
/**
 * @method appendChild
 * @param render
 */
/**
 * @method bordercolorfn
 * @param pos
 */
/**
 * @method dropshadowopacity
 */
/**
 * @method moveToFront
 */
/**
 * @method moveToBack
 */
/**
 * @event mousedblclick
 */
/**
 * @event mouseout
 */
/**
 * @event mouseover
 */
/**
 * @event mousemove
 */
/**
 * @event mouseleftdown
 */
/**
 * @event mouseleftup
 */
/**
 * @event mouserightdown
 */
/**
 * @event mouserightup
 */
/**
 * @event mousewheelx
 */
/**
 * @event mousewheely
 */
/**
 * @event mousezoom
 */
/**
 * @event keyup
 */
/**
 * @event keydown
 */
/**
 * @event keypress
 */
/**
 * @event keypaste
 */
/**
 * @event miss
 */
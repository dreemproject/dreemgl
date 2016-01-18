/**
 * @class screen
 * @extends view
 */
/**
 * @attribute {Object} [locationhash="[object Object]"]
 * the locationhash is a parsed JS object version of the #var2=1;var2=2 url arguments
 */
/**
 * @attribute {String} status
 */
/**
 * @method atConstructor
 */
/**
 * @method oninit
 * @param previous
 */
/**
 * @method defaultKeyboardHandler
 * @param target
 * @param v
 */
/**
 * @method contextMenu
 * display a classic "rightclick" or "dropdown" menu at position x,y - if no x,y is provided, last mouse coordinates will be substituted instead.
 * @param commands
 * @param x
 * @param y
 */
/**
 * @method globalMouse
 * @param node
 */
/**
 * @method remapMouse
 * internal: remap the mouse to a view node
 * @param node
 * @param dbg
 */
/**
 * @method debugPick
 * pick a view at the mouse coordinate and console.log its structure
 */
/**
 * @method releaseCapture
 */
/**
 * @method bindInputs
 * bind all keyboard/mouse/touch inputs for delegating it into the view tree
 */
/**
 * @method setFocus
 * set the focus to a view node
 * @param view
 */
/**
 * @method focusNext
 * focus the next view from view
 * @param view
 */
/**
 * @method focusPrev
 * focus the previous view from view
 * @param view
 */
/**
 * @method inModalChain
 * check if a view is in the modal chain
 * @param view
 */
/**
 * @method closeModal
 * close the current modal window
 * @param value
 */
/**
 * @method releaseCapture
 */
/**
 * @method closeModal
 * open a modal window from object like so: this.openModal( view({size:[100,100]}))
 * @param value
 */
/**
 * @method openModal
 * @param render
 */
/**
 * @method startAnimationRoot
 * internal, start an animation, delegated from view
 * @param obj
 * @param key
 * @param value
 * @param track
 * @param promise
 */
/**
 * @method stopAnimationRoot
 * internal, stop an animation, delegated from view
 * @param obj
 * @param key
 */
/**
 * @method atRender
 * called when something renders
 */
/**
 * @method doAnimation
 * internal, called by the renderer to animate all items in our viewtree
 * @param time
 * @param redrawlist
 */
/**
 * @event wakeup
 */
/**
 * @event globalkeyup
 */
/**
 * @event globalkeydown
 */
/**
 * @event globalkeypress
 */
/**
 * @event globalkeypaste
 */
/**
 * @event globalmousemove
 */
/**
 * @event globalmouseleftdown
 */
/**
 * @event globalmouseleftup
 */
/**
 * @event globalmouserightdown
 */
/**
 * @event globalmouserightup
 */
/**
 * @event globalmousewheelx
 */
/**
 * @event globalmousewheely
 */
/**
 * @class screen
 * @extends view
 * Screens are the root of a view hierarchy, typically mapping to a physical device.
 */
/**
 * @attribute {Object} [locationhash="[object Object]"]
 * the locationhash is a parsed JS object version of the #var2=1;var2=2 url arguments
 */
/**
 * @method contextMenu
 * display a classic "rightclick" or "dropdown" menu at position x,y - if no x,y is provided, last mouse coordinates will be substituted instead.
 * @param commands
 * @param x
 * @param y
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
 * @method closeModal
 * open a modal window from object like so: this.openModal( view({size:[100,100]}))
 * @param value
 */
/**
 * @method atRender
 * called when something renders
 */
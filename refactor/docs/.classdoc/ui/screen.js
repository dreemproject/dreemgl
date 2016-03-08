/**
 * @class screen
 * @extends view
 * Screens are the root of a view hierarchy, typically mapping to a physical device.
 */
/**
 * @method contextMenu
 * TODO(aki): move menu into a configurable component.
 * internal, display a classic "rightclick" or "dropdown" menu at position x,y - if no x,y is provided, last pointer coordinates will be substituted instead.
 * @param commands
 * @param x
 * @param y
 */
/**
 * @method debugPick
 * pick a view at the pointer coordinate and console.log its structure
 * @param x
 * @param y
 */
/**
 * @method setFocus
 * set the focus to a view node
 * @param view
 */
/**
 * @method closeModal
 * open a modal window from object like so: this.openModal( view({size:[100,100]}))
 * @param value
 */
/**
 * @method openOverlay
 * open an overlay
 * @param render
 */
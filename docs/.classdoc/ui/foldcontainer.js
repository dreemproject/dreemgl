/**
 * @class foldcontainer
 * @extends view
 * the foldcontainer shows/hides all its children when the top bar is clicked
 */
/**
 * @attribute {boolean} collapsed
 * The current state of the foldcontainer. false = open, Ttue = closed.
 */
/**
 * @attribute {String} [icon="times"]
 * The icon to use in the top left of the foldcontainer. See the FontAwesome cheatsheet for acceptable icon names.
 */
/**
 * @attribute {String} [title="folding thing"]
 */
/**
 * @attribute {vec4} [basecolor="0.501960813999176,0.501960813999176,0.7529411911964417,1"]
 * The main color from which the foldcontainer will build some gradients.
 */
/**
 * @attribute {float32} [fontsize="12"]
 */
/**
 * @attribute {boolean} autogradient
 */
/**
 * @method toggle
 * Function to change the open/closed state. Used by the click handler of the clickablebar.
 */
/**
 * @method render
 */
/**
 * @class foldcontainer.clickablebar
 * @extends view
 * subclass to lay out the clickable portion of the folding container
 */
/**
 * @attribute {String} title
 */
/**
 * @attribute {String} icon
 */
/**
 * @attribute {vec4} [col1="0,0,0,0"]
 */
/**
 * @attribute {vec4} [col2="0,0,0,0"]
 */
/**
 * @attribute {boolean} collapsed
 */
/**
 * @method bggradient
 * @param a
 * @param b
 */
/**
 * @method toggle
 * default click-handler - when not bound this write "nothing happens" to the console.
 */
/**
 * @method render
 * The clickable bar creates icon and a textfield children.
 */
/**
 * @method statedefault
 * @param first
 */
/**
 * @method stateover
 */
/**
 * @method stateclick
 */
/**
 * @method layout
 */
/**
 * @method init
 */
/**
 * @class foldcontainer.containerview
 * @extends view
 * the main container view
 */
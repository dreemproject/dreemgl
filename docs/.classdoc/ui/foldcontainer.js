/**
 * @class foldcontainer
 * @extends view
 * The foldcontainer shows/hides all its children when the top bar is clicked
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/foldcontainer.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/foldcontainer.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {boolean} [collapsed="false"]
 * The current state of the foldcontainer. false = open, Ttue = closed.
 */
/**
 * @attribute {String} [icon="undefined"]
 * The icon to use in the top left of the foldcontainer. See the FontAwesome cheatsheet for acceptable icon names.
 */
/**
 * @attribute {vec4} [basecolor="0.501960813999176,0.501960813999176,0.7529411911964417,1"]
 * The main color from which the foldcontainer will build some gradients.
 */
/**
 * @method toggle
 * Function to change the open/closed state. Used by the click handler of the clickablebar.
 */
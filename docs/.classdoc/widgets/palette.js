/**
 * @class palette
 * @extends view
 * A palatte is a container view with drag-dropable components
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$widgets/palette.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$widgets/palette.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {Object} [items="undefined"]
 * The items to render into the palette.  This is either an array of components, or an Object where
 * every key:value pair is a Section Name : components-array pair.
 * Each component is an Object with `label` and `desc` properties, in addition to one of
 * `image`, `icon`, or `text` properties.  `image` is the url or file path to an image, icon is the
 * FontAwesome icon identifier, and `text` is simply some printed text.
 */
/**
 * @attribute {Function} [dropTest="undefined"]
 * Function to call globally when testing if a palette item can be dropped onto another view.
 * This can also be defined on the individual components to override behavior.
 * The signature of the function is function(dropevent,view,item,origevent,dropview){}
 */
/**
 * @attribute {Function} [drop="undefined"]
 * Function to call globally when dropping a palette item onto a view.
 * This can also be defined on the individual components to override behavior.
 * The signature of the function is function(dropevent,view,item,origevent,dropview){}
 */
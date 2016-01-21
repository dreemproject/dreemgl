/**
 * @class slideviewer
 * @extends view
 * slide viewer is an automatic slide viewer that turns child nodes into slides
 * use attributes named 'slidetitle' on a child to set the slide title1
 */
/**
 * @attribute {float32} [slidewidth="1024"]
 * the width of a slide
 */
/**
 * @attribute {float32} [slideheight="1024"]
 * the height of a slide
 */
/**
 * @attribute {float32} [slidemargin="10"]
 * the margin between slides
 */
/**
 * @attribute {int32} page
 * the current page
 */
/**
 * @attribute {vec2} [scroll="0,0"]
 * animate the scroll
 */
/**
 * @attribute {vec3} [pos="0,0,0"]
 * persist the postiion
 */
/**
 * @method focuslost
 * deny focus loss
 */
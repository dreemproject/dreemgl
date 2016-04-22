/**
 * @class morph3d
 * @extends view
 * Morphing 3d geometry class.
 * Target geometries are specified as children.
 * Both target geometries should have the same vertex attribues and vertex count.
 */
/**
 * @attribute {float32} [morphweight="0"]
 * Morph weight - determines the interpolation between target shapes
 */
/**
 * @attribute {vec4} [bgcolor="1,1,1,1"]
 * Shape color
 */
/**
 * @attribute {float32} [opacity="1"]
 * Shape opacity
 */
/**
 * @method bgcolorfn
 * Overridable bgcolor function
 * @param pos
 */
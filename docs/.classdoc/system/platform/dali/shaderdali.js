/**
 * @class shaderdali
 * @extends shader
 */
/**
 * @method compileShader
 * @param gldevice
 */
/**
 * @method useShader
 * @param gl
 * @param shader
 */
/**
 * @method mapUniforms
 * Override from shader.js (DALI)
 * @param gl
 * @param shader
 * @param uniforms
 * @param uniset
 * @param unilocs
 */
/**
 * @method mapTextures
 * @param gl
 * @param shader
 * @param textures
 * @param texlocs
 */
/**
 * @method useShaderTemplate
 * Template for generated code
 * {object} gl stubbed out gl object
 * {object} shader compiled shader object, containing dalishader
 * and daligeometry. (see compileShader in this file)
 * {object} root display object (ex. border, hardrect), containing
 * dalimaterial, dalirenderer, daliactor.
 * @param gl
 * @param shader
 * @param root
 */
/**
 * @method compileUse
 * {object} shader DaliShader object, amended with location information
 * (see getLocations call above)
 * The 'this' pointer is a view
 * @param shader
 */
/**
 * @method drawArrays
 * lets draw ourselves.
 * A view (the this pointer) makes one call to drawArrays for each shader.
 * A typical number is two (one for border and one for hardimage
 * @param devicegl
 * @param sub
 * @param start
 * @param end
 */
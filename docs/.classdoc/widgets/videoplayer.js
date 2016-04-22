/**
 * @class videoplayer
 * @extends view
 * Simple video player, without controls. Frames from a html5 video are
 * copied into a canvas element. Each image is written to the view's texture.
 * The view needs to use the hardimage shader, so the view is initialized
 * with an empty texture. The video and canvas resources are allocated when
 * the video plays, and released when the video is finished.
 */
/**
 * @attribute {String} [url=""]
 * The URL to an video file to play
 */
/**
 * @attribute {boolean} [autoplay="true"]
 * When true (default), start the video track automatically.
 */
/**
 * @attribute {float32} [volume="0.5"]
 * Video volume (0-1)
 */
/**
 * @method play
 * Play the video
 */
/**
 * @method pause
 * Pause or restart the video
 */
/**
 * @method stop
 * Stop the video
 */
/**
 * @method updatevideo
 * Update the texture with a current screenshot from the video.
 */
/**
 * @method videoinit
 * Initialize the VideoContext
 */
/**
 * @method videocleanup
 * Cleanup the VideoContext and canvas
 */
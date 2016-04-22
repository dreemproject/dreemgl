/**
 * @class audioplayer
 * @extends view
 * Simple audio player, without controls. While the audio plays, a visual
 * representation of the audio can be displayed in the view
 */
/**
 * @attribute {String} [url=""]
 * The URL to an audio file to play
 */
/**
 * @attribute {boolean} [autoplay="true"]
 * When true (default), start the audio track automatically.
 */
/**
 * @attribute {float32} [volume="0.5"]
 * Audio volume (0-1)
 */
/**
 * @attribute {int32} [fftsize="512"]
 * Number of fft frames to use. Non-zero power of two from 32 to 2048
 */
/**
 * @attribute {float32} [fftsmoothing="0.8"]
 * Amount of smoothing to apply to the fft analysis (0-1)
 */
/**
 * @method play
 * Play the audio
 */
/**
 * @method pause
 * Pause or restart the audio
 */
/**
 * @method stop
 * Stop the audio
 */
/**
 * @method updateviz
 * Update the current visualization
 */
/**
 * @method audioinit
 * Initialize the AudioContext
 */
/**
 * @method audiocleanup
 * Cleanup the AudioContext
 */
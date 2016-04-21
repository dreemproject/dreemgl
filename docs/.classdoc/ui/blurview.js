/**
 * @class blurview
 * @extends view
 * Example of how to use multiple render passes
 */
/**
 * @method buildKernel
 * Compute the kernel parameters given blurradius.
 * The value of sigma is .5 * blurradius
 * The filter length is 2*blurradius + 1 (in the range of 1 to 21)
 * For large blurradius, 21 filter parameters are computed.
 */
/**
 * @method onblurradius
 * Rebuild the kernel when the blurradius changes
 * @param ev
 * @param v
 * @param o
 */
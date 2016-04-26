/**
 * @class blurview
 * @extends view
 * Uses multiple render passes to render a gaussian blur over the view's contents
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$ui/blurview.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$ui/blurview.js">open example in new tab &raquo;</a>
 * 
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
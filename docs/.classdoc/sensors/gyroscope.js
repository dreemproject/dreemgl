/**
 * @class gyroscope
 * @extends node
 * The gyro receives gyroscope and compass data where available.
 * See [deviceorientation](https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation) and [DeviceOrientationEvent](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
 * <br/><a href="/examples/sensors">example &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$sensors/gyroscope.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$sensors/gyroscope.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {Boolean} [supported="false"]
 * True if gyro is supported
 */
/**
 * @attribute {vec3} [orientation="0,0,0"]
 * Three component (alpha, beta, gamma) orientation of the device
 */
/**
 * @attribute {typeless} [alpha="undefined"]
 * Alias for the alpha component of orientation
 */
/**
 * @attribute {typeless} [beta="undefined"]
 * Alias for the beta component of orientation
 */
/**
 * @attribute {typeless} [gamma="undefined"]
 * Alias for the gamma component of orientation
 */
/**
 * @attribute {Number} [compass="0"]
 * The compass orientation, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
 */
/**
 * @attribute {Number} [accuracy="0"]
 * The compass accuracy, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
 */
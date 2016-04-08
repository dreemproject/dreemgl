/**
 * @class hub
 * @extends service
 * The hub class makes it very easy to connect to a wide variety of devices including
 * SmartThings, Philips Hue and many more.
 * 
 * IMPORTANT: see /examples/components/iot/README.md for setup instructions.
 */
/**
 * @attribute {Array} [things=""]
 * A list of things connected to the hub, automatically updated as new devices are discovered and their state changes.
 * Each thing consists of an object containing an id, name, and a state object representing its current state's value type and if it's readonly or not.
 */
/**
 * @attribute {Boolean} [connected="undefined"]
 * If true, we are connected
 */
/**
 * @method update
 * Updates a specific thing's state to a new value
 * @param thingid
 * @param state
 * @param value
 */
/**
 * @method updateAll
 * Updates all things to a new value
 * @param state
 * @param value
 */
/**
 * @method connect
 * Override to change what gets connected. Currently attemts to connect everything.
 * @param iotdb
 */
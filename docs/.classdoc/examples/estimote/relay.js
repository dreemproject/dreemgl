/**
 * @class relay
 * @extends service
 */
/**
 * @attribute {Object} [beacons="[object Object]"]
 * Current list of beacons visible with the repeater
 * Clients will see the all the visible beacons regardless of when they joined.
 */
/**
 * @attribute {Array} [changes=""]
 * Most recent list of changes to the beacon attribute sent from the server
 * Clients will only see the latest changes added since they join.
 */
/**
 * @attribute {Object} [device_data="[object Object]"]
 * Keep track of usage by device. The key is the device uuid and the
 * value is a hash of beacon_uuid to the beacon data. Old data is removed
 * from the structure.
 */
/**
 * @attribute {Object} [beacon_data="[object Object]"]
 * Keep track of usage by beacon id. The key is the beacon id and the value
 * is a hash of device_uuid to the beacon data. Old data is removed
 * from the structure.
 */
/**
 * @method init
 */
/**
 * @method postBeacons
 * Keep track of location by device and beacon.
 * The beacon_id is the concatenation of the uuid and major and minor number.
 * @param json
 */
/**
 * @method expire_beacon_data
 * @param age
 */
/**
 * @method checkMovement
 * @param distances
 */
/**
 * @method intersection
 * Find intersection of current and previous beacons.
 * @param a
 * @param b
 */
/**
 * @method findChanges
 */
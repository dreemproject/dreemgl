/**
 * @class node
 * @extends Object
 * Node class provides attributes for events and values, propertybinding and constructor semantics
 */
/**
 * @method find
 * find node by name, they look up the .name property or the name of the constructor (class name) by default
 * @param name
 * @param ignore
 */
/**
 * @method emit
 * emit an event for an attribute key. the order
 * @param key
 * @param event
 */
/**
 * @method addListener
 * add a listener to an attribute
 * @param key
 * @param cb
 */
/**
 * @method removeListener
 * remove a listener from an attribute, uses the actual function reference to find it
 * if you dont pass in a function reference it removes all listeners
 * @param key
 * @param cb
 */
/**
 * @event init
 * always define an init and deinit
 */
/**
 * @event destroy
 * always define an init and deinit
 */
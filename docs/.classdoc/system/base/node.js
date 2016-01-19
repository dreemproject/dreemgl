/**
 * @class node
 * @extends Object
 * Node class provides attributes for events and values, propertybinding and constructor semantics
 */
/**
 * @method setInterval
 * @param fn
 * @param mstime
 */
/**
 * @method clearInterval
 * @param id
 */
/**
 * @method setTimeout
 * @param fn
 * @param mstime
 */
/**
 * @method clearTimeout
 * @param id
 */
/**
 * @method initFromConstructorArgs
 * internal, called by the constructor
 * @param args
 */
/**
 * @method mixin
 */
/**
 * @method findChild
 * internal, used by find
 * @param name
 * @param ignore
 * @param nocache
 */
/**
 * @method find
 * find node by name, they look up the .name property or the name of the constructor (class name) by default
 * @param name
 * @param ignore
 */
/**
 * @method hideProperty
 * hide a property, pass in any set of strings
 */
/**
 * @method isAttribute
 * check if property is an attribute
 * @param key
 */
/**
 * @method getAttributeConfig
 * returns the attribute config object (the one passed into this.attributes={attr:{config}}
 * @param key
 */
/**
 * @method hasWires
 * check if an attribute has wires connected
 * @param key
 */
/**
 * @method wiredCall
 * internal, returns the wired-call for an attribute
 * @param key
 */
/**
 * @method emitRecursive
 * emits an event recursively on all children
 * @param key
 * @param event
 * @param block
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
 * @method hasListenerProp
 * check if an attribute has a listener with a .name property set to fnname
 * @param key
 * @param prop
 * @param value
 */
/**
 * @method hasListeners
 * returns true if attribute has any listeners
 * @param key
 */
/**
 * @method removeAllListeners
 * remove all listeners from a node
 */
/**
 * @method setWiredAttribute
 * set the wired function for an attribute
 * @param key
 * @param value
 */
/**
 * @method definePersist
 * mark an attribute as persistent accross live reload / renders
 * @param arg
 */
/**
 * @method atStyleConstructor
 * @param original
 * @param props
 * @param where
 */
/**
 * @method animateAttribute
 * internal, animate an attribute with an animation object see animate
 * @param arg
 */
/**
 * @method defineAttribute
 * internal, define an attribute, use the attributes =  api
 * @param key
 * @param config
 * @param always_define
 */
/**
 * @method connectWiredAttribute
 * internal, connect a wired attribute up to its listeners
 * @param key
 * @param initarray
 */
/**
 * @method emitForward
 * return a function that can be assigned as a listener to any value, and then re-emit on this as attribute key
 * @param key
 */
/**
 * @method connectWires
 * internal, connect all wires using the initarray returned by connectWiredAttribute
 * @param initarray
 * @param depth
 */
/**
 * @method disconnectWires
 * internal, does nothing sofar
 */
/**
 * @method startMotion
 * internal, used by the attribute setter to start a 'motion' which is an auto-animated attribute
 * @param key
 * @param value
 */
/**
 * @method createRpcProxy
 * internal, create an rpc proxy
 * @param parent
 */
/**
 * @event init
 * always define an init and deinit
 */
/**
 * @event destroy
 * always define an init and deinit
 */
/**
 * @class dataset
 * @extends node
 * The dataset class allows you to share a single "document" between various parts of your application. 
 * The dataset provides undo/redo functionality by serializing its contents to a JSON string.
 * To modify a dataset you need to use the "fork" method. The fork method saves the current instance to the undo stack, calls back to your code and then notifies all objects that have this dataset instance bound to them to update themselves.
 */
/**
 * @method _atConstructor
 * @param data
 */
/**
 * @method atAttributeAssign
 * Handles the binding of this dataset to the attribute of something else.
 * @param obj
 * @param key
 */
/**
 * @method fork
 * Fork starts a new modification on a dataset;
 * @param callback
 * the function that will be called with a modifyable javascript object. DO NOT under any circumstances directly modify this data property!
 */
/**
 * @method silent
 * Silent operates much the same as `fork`, but does not notify listeners bound to this dataset. This can be used in case you are CERTAIN that this object is the only object in your application that listens to your changed property, but you still need to save the state to the undo stack
 * 'callback' the function that will be called with a modifyable javascript object. DO NOT under any circumstances directly modify this data property!
 * @param callback
 * function
 */
/**
 * @method notifyAssignedAttributes
 * Cause objects that have us assigned to reload
 */
/**
 * @method parse
 * convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice.
 * @param stringdata
 */
/**
 * @method stringify
 * convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
 * @param data
 * Object
 */
/**
 * @method undo
 * Go back to the previous state. All classes that have this dataset bound will get their assignment updated
 */
/**
 * @method redo
 * Go back to the previous state. All classes that have this dataset bound will get their assignment updated
 */
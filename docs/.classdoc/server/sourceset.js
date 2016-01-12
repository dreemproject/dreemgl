/**
 * @class sourceset
 * @extends dataset
 * Sourceset is a dataset-api on source
 */
/**
 * @method atConstructor
 * @param source
 */
/**
 * @method fork
 * @param callback
 */
/**
 * @method addBlock
 * @param folder
 * @param classname
 */
/**
 * @method removeBlock
 * @param blockname
 */
/**
 * @method setFlowData
 * @param block
 * @param data
 */
/**
 * @method deleteWire
 * @param sblock
 * @param soutput
 * @param tblock
 * @param tinput
 */
/**
 * @method createWire
 * @param sblock
 * @param soutput
 * @param tblock
 * @param tinput
 */
/**
 * @method process
 */
/**
 * @method parse
 * convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice.
 * @param classconstr
 */
/**
 * @method stringify
 * convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
 */
/**
 * @event change
 */
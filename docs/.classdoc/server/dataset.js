/**
 * @class dataset
 * @extends node
 * The dataset class allows you to share a single "document" between various parts of your application.
 * The dataset provides undo/redo functionality by serializing its contents to a JSON string.
 * To modify a dataset you need to use the "fork" method. The fork method saves the current instance to the undo stack, calls back to your code and then notifies all objects that have this dataset instance bound to them to update themselves.
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$server/dataset.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$server/dataset.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @method fork
 * Fork starts a new modification on a dataset;
 * @param callback
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
 * Go forward to the next state. All classes that have this dataset bound will get their assignment updated
 */
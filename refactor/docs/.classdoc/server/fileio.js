/**
 * @class fileio
 * @extends service
 * The fileio class provides an easy RPC mechanism to load/create/save/enumerate files and directories. The fileio instance should live on the server part of the composition.
 * do not ever put this in a web-facing composition as it has no security features
 */
/**
 * @method readfile
 * Return the full contents of a file as a string. Returns the result of node.js fs.readFileSync or null in case of exception
 * @param name
 * The file to read. File paths can use $-shortcuts to refer to various folders
 */
/**
 * @method writefile
 * writefile synchronously writes data to a file. Returns the result of node.js fs.writeFileSync or null in case of exception
 * @param name
 * The file to read. File paths can use $-shortcuts to refer to various folders
 * @param data
 * The data to write
 */
/**
 * @method readdir
 * reads a directory and returns its contents
 * @param name
 * the name of the directory to read
 */
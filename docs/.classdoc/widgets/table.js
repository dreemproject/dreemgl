/**
 * @class table
 * @extends view
 * A table is a container view that lays out it's children in either rows or columns.
 * Individual rows and columns can be configured via styles and are given names and style classes conforming to
 * either `row#` or `column#` style where `#` is the index of the particular row or column.
 * <br/><a href="/examples/tables">examples &raquo;</a>
 * 
 * <iframe style="border:0;width:900px;height:300px" src="/apps/docs/example#path=$widgets/table.js"></iframe>
 * <a target="blank" href="/apps/docs/example#path=$widgets/table.js">open example in new tab &raquo;</a>
 * 
 */
/**
 * @attribute {float32} [rows="-1"]
 * The number of rows in the table (not compatible with `columns`)
 */
/**
 * @attribute {float32} [columns="-1"]
 * The number of columns in the table (not compatible with `rows`)
 */
/**
 * @attribute {Enum} [justifysection=""]
 * justifycontent passed to the inner rows or columns
 */
/**
 * @attribute {Enum} [alignsection="stretch"]
 * alignitems passed to the inner rows or columns
 */
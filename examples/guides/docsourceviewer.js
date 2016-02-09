/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

/**
 * @class DocSourceViewer
 * Source code viewer which is embedded into the docs. You can select the file to be displayed
 * by adding the hash `string #file=example.js` to the URL for this composition, e.g.
 * examples/dreem_in_10/helloworldsource#file=docsourceviewer.js
 */
//
define.class("$server/composition", function (require, $ui$, screen, $widgets$, jsviewer) {

	// Composition wide configuration

	this.attributes = {
		fontsize: Config({type:float, value:12})
	};

	/**
	 * @class DocSourceViewer.FileIO
	 * Helper class used for loading a file's source code server-side to be displayed
	 * in the documentation.
	 */
	define.class(this, 'FileIO', function($server$, fileio) {
		var path = require('path');
		var fs = require('fs');
		var e = null;

		/**
		 * Reads a source file from disk and returns an object with the source and any
		 * potential exception.
		 * @param theFile
		 * @returns {string} Source code of the file, if found - or error message.
     */

		this.readSourceFile = function(theFile) {
			var basepath = (define.expandVariables(define.classPath(this)));
			var source = "// NO SOURCE CODE LOADED!";
			try {
				source = fs.readFileSync(basepath + theFile);
				// Strip out multiline comment (copyright notice)
				// Removes /* ... */\n\n
				source = source.toString().replace(/\/\*([\s\S]*?)\*\/\n\n/g, "");
			} catch (e) {
				console.log(e.toString());
				source = "/* ERROR LOADING FILE at: " + e.path + "\n" + e.toString() + " */";
			}
			return source;
		};
	}).bind(this);


	this.render = function() {
		return[
			this.FileIO({name:'fileloader'}),
				screen(
					{
						name: 'default',
						attributes: {
							sourcecode: Config({type: String, value: "// NO SOURCE CODE LOADED!"}),
							sourcefile: Config({type: String, value: ''}),
						},
						// Loads the source of the file with the filename #file=SOME_FILE using
						// the readSourceFile() function of the embedded fileio class.
						init: function () {
							if (window.location.hash) {
								var values = window.location.hash.substring(1).split("=");
								if (values[0] == 'file') {
									this.sourcefile = values[1];
								}
							}
							if (this.sourcefile === '') {
								console.warn("No source file specificied! Please specify source file name through hash, e.g. #file=somefile.js");
								this.sourcecode = "/* No source file specificied! Please specify source file name through hash, e.g. #file=somefile.js */";
							} else {
								this.rpc.fileloader.readSourceFile(this.sourcefile).then(function (result) {
									this.sourcecode = result.value;
								}.bind(this));
							}
						},
						// Renders the source code stored in the screen's source code attribute
						render: function () {
							return [
								jsviewer({
									flex: 1,
									overflow: 'scroll',
									source: wire('this.screen.sourcecode'),
									fontsize: this.screen.composition.fontsize,
									bgcolor: "#212121",
									multiline: false
								})
							];
						}
					}
				)
		];
	}
  });

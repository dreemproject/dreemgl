/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Source code viewer which is embedded into the docs. You can select the file to be displayed
// by adding the hash `string #file=example.js` to the URL for this composition, e.g.
// /examples/dreem_in_10/helloworldsource#file=docsourceviewer.js
define.class("$server/composition",
  function (
    require,
    $ui$, screen,
    $$, utility$sourceviewerscreen
  ) {

    this.attributes = {
      sourcefile: Config({type:String, value:""}),
    };

    define.class(this, 'fileio', function($server$, fileio) {

      var path = require('path');
      var fs = require('fs');
			var e = null;

      this.attributes = {
        sourcecode: Config({type:String, value:"// NO SOURCE CODE LOADED!", flow:"out"}),
      };

      this.name = 'fileio';

      this.readSourceFile = function(theFile) {
        var basepath = (define.expandVariables(define.classPath(this)));
        try {
          this.sourcecode = fs.readFileSync(basepath + theFile);
					// Strip out multiline comment (copyright notice)
					// Removes /* ... */\n\n
					this.sourcecode = this.sourcecode.replace(/\/\*([\s\S]*?)\*\/\n\n/g, "");
        } catch (e) {
          console.log(e);
        }
        return {src: src, error: e};
      };
    }).bind(this);

    this.init = function () {
      if (typeof window !== 'undefined') {
        if (window.location.hash) {
          var values = window.location.hash.substring(1).split("=");
          if (values[0] == 'file') {
            this.sourcefile = values[1];
            console.log("sourceFile=" + this.sourcefile);
          }
        }
        if (this.sourcefile === '') {
          console.warn("No source file specificied! Please specify source file name through hash, e.g. #file=somefile.js")
        }
      }
    };

    this.render = function() {
      return[
this.fileio({name:'fileloader'}),
utility$sourceviewerscreen(
	{
		 sourcecode: wire('rpc.fileloader.sourcecode'),
		 init: function () {
			 this.rpc.fileloader.readSourceFile(this.composition.sourcefile);
		 }
	}
)
      ];
    }
  });

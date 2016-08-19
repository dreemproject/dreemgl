/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/service', function(require){
	// A server-side class for handling uploads

	var fs = require('fs');

	this.attributes = {
		dir:String,
		dirpath:String,
		accepts:[],
		fileupload: Config({type:Event}),
		uploads:Config({persist:true, value:[]})
	};

	this.init = function () {
		var compfile = this.composition.constructor.module.filename;
		if (typeof(this.dir) !== "string") {
			this.dirpath = compfile.substring(0, compfile.lastIndexOf('/'));
		} else if (this.dir.indexOf('./') == 0) {
			this.dirpath = compfile.substring(0, compfile.lastIndexOf('/')) + this.dir.substring(1);
		} else {
			this.dirpath = this.dir;
		}
	};

	this.upload = function(mimetype, filename, filedata) {

		if (this.accepts && this.accepts.length && this.accepts.indexOf(mimetype) < 0) {
			console.log("Mime type", mimetype, "not in allowed.  Allowed types:", this.accepts)
			return false;
		}

		var fullname = define.expandVariables(this.dirpath + "/" + filename.replace(/[^A-Za-z0-9_.-]/g,''));

		try {
			//todo check if dir exists and if not make it, etc.  Check for security issues.
			fs.writeFile(fullname, filedata);
			console.log("[UPLOAD] Wrote", filedata.length, "bytes to", fullname);

			var filedesc = {
				name:filename,
				mime:mimetype,
				dir:this.dir,
				path:fullname,
				size:filedata.length
			};

			this.uploads.push(filedesc);
			this.emit("fileupload", { value:filedesc });
			this.uploads = this.uploads;

			return true;
		} catch (e) {
			console.log("[UPLOAD ERROR] Could not write", filedata.length, "bytes to", fullname, "due to:", e);
			return false;
		}

	}

});

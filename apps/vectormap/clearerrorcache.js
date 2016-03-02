/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

// parse all files in the cache - throw them away if they contain invalid json for some reason.
// nodejs standalone javascript file. -Not a composition.

var fs   = require('fs');

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

console.log("Scanning cache folder..")
fileset = getFiles('tilecache');

console.log(fileset.length + " files in the cache!");
console.log("Parsing them!")
var bytes = 0;
for(var i =0 ;i<fileset.length;i++){
	var s = fs.readFileSync("./"+ fileset[i]);
	try{
		JSON.parse(s)
		bytes += s.length;
	}
	catch(e){
		console.log("error in " + fileset[i] + ". Removing from cache.");
		fs.unlinkSync("./" + fileset[i]);
	}

}

console.log((bytes/(1024*1024)).toString()+ " megabytes of valid cache!");

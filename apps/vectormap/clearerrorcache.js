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
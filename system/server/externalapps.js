/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// controls external applications

define(function(require, exports){
	var child_process = require('child_process')

	 // Opens a webbrowser on the specified url 
	 exports.browser = function(url, withdevtools){
	 	if(false){//process.platform == 'darwin'){
	 		child_process.exec('osascript -e \'tell application "Safari" to open location "'+url+'"\'')
			if(withdevtools){
				child_process.exec('osascript -e \'tell application "Safari"\n\treopen\nend tell\ntell application "System Events" to keystroke "c" using {option down, command down}\'')
			}
	 	}
	 	else if(process.platform == 'darwin'){
			// can we spawn safari?

			// Spawn google chrome
			child_process.spawn(
				"/Applications/Google chrome.app/Contents/MacOS/Google Chrome",
				["--incognito",url])
			// open the devtools 
			if(withdevtools){
				setTimeout(function(){
					child_process.exec('osascript -e \'tell application "Chrome"\n\treopen\nend tell\ntell application "System Events" to keystroke "j" using {option down, command down}\'')
				},200)
			}
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for browser spawn")
		}
	}

	// Opens a code editor on the file / line / column
	exports.editor = function(file, line, col){
		if(process.platform == 'darwin'){
			// Only support sublime for now
			child_process.spawn(
				"/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl",
				[file + ':' + line + (col!==undefined?':'+col:'')])
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for editor spawn")
		}
	}

	// Opens a tray notification
	exports.notify = function(body, title, subtitle){
		if(process.platform == 'darwin'){
			child_process.spawn("osascript",
				["-e",'display notification \"'+body.replace(/"/g,'\\"')+'\" '+(title?'with title \"'+title.replace(/"/g,'\\"')+'\" ':'')+(subtitle?'subtitle \"'+subtitle.replace(/"/g,'\\"')+'\"':'')])
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for notify spawn")
		}
	}
})
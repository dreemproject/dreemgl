/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define(function(require, exports, module){
// promisified node http api

	var http = require('http')
	var url = require('url')
	
	exports.get = function nodehttp(httpurl){
		return new Promise(function(resolve, reject){
			if (url && http) {
				var myurl = url.parse(httpurl)

				http.get({
						host: myurl.hostname,
						port: myurl.port,
						path: myurl.path
					},
					function(res){
						var data = ''
						res.on('data', function(buf){ data += buf })
						res.on('end', function(){
							// write it and restart it.
							resolve(data)
						})
						res.on('error', function(error){
							reject(error)
						})
					})
			} else {
				reject('NOT ON SERVER SIDE')
			}
		})
	}
})
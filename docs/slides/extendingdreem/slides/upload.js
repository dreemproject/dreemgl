/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function ($ui$, view, label, icon) {

    this.slidetitle = "File Upload via POST API";

    this.bgcolor = "transparent";
    this.flexdirection = "column";
	this.padding = 20;

    this.attributes = {
		files:[]
    };

	this.setupFileDrop = function () {
		var doc = document.documentElement;
		doc.ondragover = function (e) { return false; }.bind(this);
		doc.ondragend = function (e) { return false; }.bind(this);
		doc.ondrop = function (e) {
			e.preventDefault && e.preventDefault();
			var files = e.dataTransfer.files;

			var formData = new FormData();
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				formData.append('file', file);
			}

			var xhr = new XMLHttpRequest();
			xhr.open('POST', window.location.pathname, true);
			xhr.onload = function() {
				if (xhr.status === 200) {
					this.reload();
				} else {
					console.log('Oops, upload failed', xhr, files);
				}
			}.bind(this);
			xhr.send(formData);

			return false;
		}.bind(this);
	};

	this.reload = function() {
		this.rpc.fileio.ls().then(function(result){
			var files = result.value;
			this.files = files;
		}.bind(this))
	};

	this.init = function() {
		this.setupFileDrop();
		this.reload();
	};

    this.render = function render() {

		var fileviews = [];

		for (var i=0;i<this.files.length;i++) {
			var filename = this.files[i];
			fileviews.push(label({text:filename}))
		}

        return [
            label({fgcolor:'red', bgcolor:'transparent', text:'(Use POST API when sending large data files)'}),
			this.bullet({text:"All compositions accept multipart/form-data POSTs", margintop:30}),
			this.bullet({text:"Uploaded files are automatically saved to the current\ncomposition's base directory.", margintop:30}),
			view({flex:1, bgcolor:"transparent", alignitems:"center", flexdirection:"row", justifycontent:"space-around", margintop:50, borderradius:30},
				view({flexdirection:"column", alignitems:"center", marginright:50},
					label({fgcolor:"#333", text:"Drop Files Here"}),
         			icon({flex:1, icon:"bullseye", fontsize:300, fgcolor:"red"})
				),
				view({flex:1, flexdirection:"column", marginright:50},
					view({flex:1, padding:20, flexdirection:"column", height:200, borderradius:30, bgcolor:vec4(0.07999999821186066, 0.10000000149011612, 0.10000000149011612, 1)},
						label({fgcolor:"yellow", text:"Files currently in ./docs/slides/extendingdreem/ ", marginbottom:5}),
						fileviews)
				)
			)
        ];
    }

	define.class(this, "bullet", view, function(){

		this.attributes = {
			icon:Config({type:String, value:"folder"}),
			fontsize:Config({type:int, value:25}),
			text:Config({type:String})
		};

		this.render = function () {
			return [
				icon({icon:this.icon, fgcolor:'#333', fontsize:this.fontsize, marginright:20}),
				label({text:this.text, fgcolor:'#333', fontsize:this.fontsize})
			]
		}

	});


});

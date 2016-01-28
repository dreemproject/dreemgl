/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Screen used for displaying the source code of a class, used by the docsourceviewer composition.
define.class("$ui/screen",
  function (
    $widgets$, jsviewer
  ) {

    this.attributes = {
      sourcecode: Config({type:String, value:"// NO SOURCE CODE LOADED!"}),
    };

    this.sourcecode = function() {
      this.children[0].source = this.sourcecode;
    }

    this.name = 'default'
    this.render = function() {
      return[
        jsviewer({ flex: 1, overflow:'scroll',  source: this.sourcecode, fontsize: 12, bgcolor: "#212121", multiline: false}),
      ];
    }
  });

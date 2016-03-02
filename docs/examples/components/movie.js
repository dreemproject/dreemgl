/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $ui$, view, label) {

    this.flexdirection = 'column';
    this.padding = 10;
    this.margin = 10;
    this.borderwidth = 2;
    this.bordercolor = vec4(0.3,0.3,0.3,0.3);

    this.attributes = {
        Title:  Config({type: String, value: ""}),
        Year:   Config({type: String, value: ""}),
        imdbID: Config({type: String, value: ""}),
        Type:   Config({type: String, value: ""}),
        Poster: Config({type: String, value: ""})
    };

    this.onPoster = function (event) {
        this.bgimage = event.value;
    };

    this.render = function() { return [
        label({
            name:"label",
            text:this.Title + " (" + this.Year + ")",
            fgcolor:'white',
            fontsize:10,
            bgcolor:vec4(0,0,0,0.5),
            multiline: true
        })
    ]}
});

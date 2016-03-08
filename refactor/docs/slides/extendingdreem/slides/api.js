/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $ui$, view, label, textbox) {

    this.slidetitle = "Attribute Access via POST API";

    this.attributes = {
        setterCode: 'require "net/http";\n' +
        'require "json";\n' +
        '\n' +
        'uri = URI.parse("http://localhost:2000/docs/slides/extendingdreem")\n' +
        '\n' +
        'Net::HTTP.start(uri.hostname, uri.port) do |http|\n' +
        '\n' +
        '  (req = Net::HTTP::Post.new(uri)).body = {\n' +
        '    rpcid: "omdbsearch",\n' +
        '    type: "attribute",\n' +
        '    attribute: "keyword",\n' +
        '    value: "Monkey"\n' +
        '  }.to_json\n' +
        '\n' +
        '  puts "sending JSON: #{req.body}"\n' +
        '  http.request(req)\n' +
        '\n' +
        'end',
        getterCode: 'require "net/http";\n' +
        'require "json";\n' +
        '\n' +
        'uri = URI.parse("http://localhost:2000/docs/slides/extendingdreem")\n' +
        '\n' +
        'Net::HTTP.start(uri.hostname, uri.port) do |http|\n' +
        '\n' +
        '  (req = Net::HTTP::Post.new(uri)).body = {\n' +
        '    rpcid: "omdbsearch",\n' +
        '    type: "attribute",\n' +
        '    attribute: "keyword",\n' +
        '    get: true\n' +
        '  }.to_json\n' +
        '\n' +
        '  puts "sending JSON: #{req.body}"\n' +
        '  res = http.request(req)\n' +
        '  puts "response JSON: #{res.body}"\n' +
        '\n' +
        'end'
    };

    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({marginleft:15, fgcolor:'red', bgcolor:'transparent', text:'(Use POST API to directly drive DreemGL through attribute manipulation)'}),
            view({flexdirection: 'row', flex: 1, bgcolor:'transparent'},
                view(
                    {flexdirection: 'column', flex: 1, alignself: 'stretch', margin: vec4(10), padding: vec4(4), clipping:true, bgcolor:'transparent'},
                    label({height:30, fgcolor:'#333', bgcolor:'transparent', fontsize:14, flex: 0, alignself: 'stretch', text:'Set Attribute via API (Ruby Example)'}),
                    textbox({ flex: 1, alignself: 'stretch', readonly:false, value: this.setterCode, fontsize: 14, fgcolor:'aqua', bgcolor: "#000030", multiline: true})
                ),
                view(
                    {flexdirection: 'column', flex: 1, alignself: 'stretch', margin: vec4(10), padding: vec4(4), clipping:true, bgcolor:'transparent'},
                    label({height:30, fgcolor:'#333', bgcolor:'transparent', fontsize:14, flex: 0, alignself: 'stretch', text:'Get Attribute via API (Ruby Example)'}),
                    textbox({ flex: 1, alignself: 'stretch', readonly:false, value: this.getterCode, fontsize: 14, fgcolor:'pink', bgcolor: "#000030", multiline: true})
                )
            ),
            view(
                {flexdirection: 'column', flex: 0, alignself: 'stretch', padding:10, bgcolor:'transparent'},
                label({fontsize:28, bgcolor:'transparent', text: wire('"The current value of search.keyword is: " + this.rpc.omdbsearch.keyword'), alignself: 'center'}),
                label({fontsize:18, bgcolor:'transparent', text:'(Try using the POST API scripts in ./docs/slides/extendingdreem/bin/ to get and set this value!)', alignself: 'center'})
            )
        ];
    }
});

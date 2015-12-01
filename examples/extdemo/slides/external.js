/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($containers$, view, $controls$, label, $widgets$, codeviewer, $, cells, device) {

    this.slidetitle = "Method Calls via POST API";

    this.bgcolor = "transparent";
    this.flexdirection = "column";

    this.attributes = {
        deviceList: {type: Array},
        devices: {type: Object},
        apiCode: {type: String},
        clientCode: {type: String, value:
        'require "net/htttp";\n' +
        'require "json";\n' +
        '\n' +
        'uri = URI.parse("http://localhost:2000/extdemo")\n' +
        'Net::HTTP.start(uri.hostname, uri.port) do |http|\n' +
        '\n' +
        '  (req = Net::HTTP::Post.new(uri)).body = {\n' +
        '    rpcid: "devbus",\n' +
        '    type: "method",\n' +
        '    method: "notify",\n' +
        '    args: ["deviceID","deviceType","<join/part>"]\n' +
        '  }.to_json\n' +
        '\n' +
        '  puts "sending JSON: #{req.body}"\n' +
        '  http.request(req)\n' +
        '\n' +
        'end'}
    };

    this.ondevices = function (e) {
        var devices = e.value;

        var deviceList = [];
        for (var d in devices) {
            if (devices.hasOwnProperty(d)) {
                deviceList.push({ deviceId: d, deviceType: devices[d] })
            }
        }
        this.deviceList = deviceList;
    };

    this.render = function render() {
        return [
            label({marginleft:15, fgcolor:'red', bgcolor:'transparent', text:'Use POST API when data is coming from external source, like IoT devices!'}),
            view({flexdirection: 'row', flex: 1, bgcolor:'transparent'},
                view(
                    {flexdirection: 'column', flex: 1, alignself: 'stretch', margin: vec4(10), padding: vec4(4), clipping:true, bgcolor:'transparent'},
                    label({height:30, fgcolor:'#333', bgcolor:'transparent', fontsize:14, flex: 0, alignself: 'stretch', text:'DreemGL Server (./compositions/extdemo/devices.js)'}),
                    codeviewer({ flex: 1, alignself: 'stretch', source: this.apiCode, fontsize: 13, bgcolor: "#000030", multiline: true}),
                    label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, alignself: 'stretch', text:'Method call via API (Ruby Example)'}),
                    label({ flex: 1, alignself: 'stretch', text: this.clientCode, fontsize: 12, fgcolor:'yellow', bgcolor: "#000030", multiline: false})
                ),
                view(
                    {flexdirection: 'column', flex: 1, alignself: 'stretch', clipping:true, padding: 4, margin: 10, bgcolor:'transparent'},
                    label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, alignself: 'stretch', text:'Active Devices'}),
                    label({fontsize:10, fgcolor:'#333', bgcolor:'transparent', height:30, flex: 0, alignself: 'stretch', text:'(run ./compositions/extdemo/bin/createdevices.rb to simulate device activity)'}),
                    cells({flex: 1, bgcolor: '#D1CAB0', cellwidth:80, cellheight:80, data:this.deviceList, celltype:device, cornerradius: 0})
                )
            )
        ];
    }
});
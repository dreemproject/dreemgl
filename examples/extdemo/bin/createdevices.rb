#!/usr/bin/ruby

# Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
# You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
# either express or implied. See the License for the specific language governing permissions and limitations under the License.

require 'net/http'
require 'json'

devices = {
    'BEACON 814' => 'beacon',
    'Office' => 'home',
    'Laptop' => 'laptop',
    'Inbox' => 'message',
    'BT mic' => 'mic',
    'iPhone' => 'phone',
    'Charging' => 'power',
    'Brother 429' => 'printer',
    'Kitchen Lamp' => 'smartbulb',
    'Console' => 'terminal',
    'LED H4500' => 'tv',
    'Wallet' => 'wallet',

    'WiFi' => 'beacon',
    'Home Network' => 'home',
    'Desktop' => 'laptop',
    'SMS' => 'message',
    'Android' => 'phone',
    'Air Print' => 'printer',
    'Lights' => 'smartbulb',
    'Smart TV' => 'tv'
}

loop do

  selected = devices.to_a.sample
  action = %w(join part).sample

  uri = URI.parse("http://localhost:2000/extdemo")
  Net::HTTP.start(uri.hostname, uri.port) do |http|
    (req = Net::HTTP::Post.new(uri)).body = {
        rpcid: "devbus",
        type: "method",
        method: "notify",
        args: [selected.first, selected.last, action]
    }.to_json
    puts req.body
    http.request(req)
  end

  sleep(1.5)

end
#!/usr/bin/ruby

# Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
# You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
# either express or implied. See the License for the specific language governing permissions and limitations under the License.

require "net/http"
require "json"

uri = URI.parse("http://localhost:2000/extdemo")

Net::HTTP.start(uri.hostname, uri.port) do |http|

  (req = Net::HTTP::Post.new(uri)).body = {
      rpcid: "search",
      type: "attribute",
      attribute: "keyword",
      get: true
  }.to_json

  puts "sending JSON: #{req.body}"
  res = http.request(req)
  puts "response JSON: #{res.body}"

end

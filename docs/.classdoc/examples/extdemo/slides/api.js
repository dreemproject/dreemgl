/**
 * @class api
 * @extends view
 */
/**
 * @attribute {String} [setterCode="require "net/http";
require "json";

uri = URI.parse("http://localhost:2000/examples/extdemo")

Net::HTTP.start(uri.hostname, uri.port) do |http|

  (req = Net::HTTP::Post.new(uri)).body = {
    rpcid: "search",
    type: "attribute",
    attribute: "keyword",
    value: "Monkey"
  }.to_json

  puts "sending JSON: #{req.body}"
  http.request(req)

end"]
 */
/**
 * @attribute {String} [getterCode="require "net/http";
require "json";

uri = URI.parse("http://localhost:2000/examples/extdemo")

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

end"]
 */
/**
 * @method render
 */
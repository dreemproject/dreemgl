/**
 * @class external
 * @extends view
 */
/**
 * @attribute {Array} [deviceList=""]
 */
/**
 * @attribute {Object} [devices="[object Object]"]
 */
/**
 * @attribute {String} apiCode
 */
/**
 * @attribute {String} [clientCode="require "net/htttp";
require "json";

uri = URI.parse("http://localhost:2000/examples/extdemo")
Net::HTTP.start(uri.hostname, uri.port) do |http|

  (req = Net::HTTP::Post.new(uri)).body = {
    rpcid: "devbus",
    type: "method",
    method: "notify",
    args: ["deviceID","deviceType","<join/part>"]
  }.to_json

  puts "sending JSON: #{req.body}"
  http.request(req)

end"]
 */
/**
 * @method ondevices
 * @param e
 */
/**
 * @method render
 */
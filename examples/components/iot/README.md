# IOT

## Setup

### Install Node Modules

Be sure to run `npm install` in the IOT component directory:

    cd ./classes/iot
    npm install
    ./node_modules/homestar/bin/homestar setup

### Pair to IOT devices

Dreemgl makes it easy to pair to many different kinds of IOT devices. We've tested pairing to Philips Hue and Samsung Smart Things hubs, but many more should work including https://github.com/dpjanes/homestar-samsung-smart-tv, https://github.com/dpjanes/homestar-wemo and more. See https://homestar.io/about/things for more details on pairing a specific device. 

#### Philips Hue

    ./node_modules/homestar/bin/homestar install homestar-hue
    ./node_modules/homestar/bin/homestar configure homestar-hue

Follow the prompts. Note that you may need to unplug and plug in the ethernet port on your hue, then refresh your browser to see the 'Pair' button. When finished, hit control-c a few times to get back to the shell.

#### Smart Things

    ./node_modules/homestar/bin/homestar install homestar-smartthings
    ./node_modules/homestar/bin/homestar configure homestar-smartthings

Follow the prompts, it's a lengthy process. When finished, hit control-c a few times to get back to the shell.

## Running

You should be ready to roll. Start up your dreemgl server and try out some examples!

http://localhost:2000/examples/components/iot/ should show a listing of all connected IOT devices.

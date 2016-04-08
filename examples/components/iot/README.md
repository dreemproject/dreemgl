# IOT

## Setup

### Node Modules

Be sure to run `npm install` in the IOT component directory:

    cd ./classes/iot
    npm install
    ./node_modules/homestar/bin/homestar setup

### Philips Hue

    ./node_modules/homestar/bin/homestar install homestar-hue
    ./node_modules/homestar/bin/homestar configure homestar-hue

Follow the prompts. Note that you may need to unplug and plug in the ethernet port on your hue, then refresh your browser to see the 'Pair' button. When finished, hit control-c a few times to get back to the shell.

### Smart Things

    ./node_modules/homestar/bin/homestar install homestar-smartthings
    ./node_modules/homestar/bin/homestar configure homestar-smartthings

Follow the prompts, it's a lengthy process. When finished, hit control-c a few times to get back to the shell.

### Link iotdb configuration to the root

    cd ../../ # back to the dreemgl root
    ln -s classes/iot/.iotdb/ .

## Running

http://localhost:2000/examples/components/iot/ should show a listing of all connected IOT devices.

# Phillips Hue 

## Setup

### Node Modules

Be sure to run `npm install` in the hue component directory:

    cd ./examples/components/iot
    
    npm install

    ./node_modules/homestar/bin/homestar setup

### Philips Hue

    ./node_modules/homestar/bin/homestar install homestar-hue

    ./node_modules/homestar/bin/homestar configure homestar-hue

Follow the prompts. Note that you may need to unplug and plug in the ethernet port on your hue, then refresh your browser to see the 'Pair' button

### Smart Things

    ./node_modules/homestar/bin/homestar install homestar-hue

    ./node_modules/homestar/bin/homestar configure homestar-hue

Follow the prompts.

## Link iotdb configuration to the root

    ln -s examples/components/iot/.iotdb/ .

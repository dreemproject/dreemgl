# Phillips Hue 

## Setup

### Node Modules

Be sure to run `npm install` in the hue component directory, or install `node-hue-api` globally:

    cd ./examples/components/hue
    
    npm install

### Username

#### Manual

In order to use the `basestation` to control a Phillips Hue basestation you first must obtain the base station's 
username, a process as described in Phillip's [Developer Guide](http://www.developers.meethue.com/documentation/getting-started),
and required physical access to the device.  Once a username is obtained it will continue to remain valid, so this process
only needs to be perfomed once.  The username should be set in index.js (line #13) on the `basestation` instance as follows e.g.

    basestation({username:"6ba5c7d32222e31f779722a818296a09"})

#### Automatic

Usernames can be automatically generated though the missing link dialog that appears when the Hue component is unable to 
find a username.  This username is not stored in the compositons, so you will have to reconnect any time you restart
or reload the server.



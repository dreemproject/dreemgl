# Dali - Getting Started


## Prerequisites
 * Ubuntu 14.04 with DALi 1.1.15 or later.
 * Odroid XU3 with Tizen 3.0, custom DDK from DALi UK, DALI 1.1.15 or later.

## Running DreemGL applications in Dali
To launch a DreemGL application in DALi runtime, you need to launch the DreemGL server.js file with some additional command line options, e.g.:

```Bash
node server.js -width 600 -height 600 -dali examples/nulltest
```

There is a default folder hard coded into the Dreem

| Option  |          | Description                                                         |
| ------- | -------- | ------------------------------------------------------------------- |
| width   | Optional | Width of dali stage. default = 1920 pixels |
| height  | Optional | Height of dali stage. defualt = 1080 pixels |
| name    | Optional | Window name to display |
| dali    | Required | Location of the dreemgl application to run. This can be the name of a directory containing the application, or the name of a single javascript file (without the ```.js``` suffix)
| dalilib | Optional | Path to the dali/nodejs library. Default = ```/home/dali/teem/src/dreemgl/Release/dali```


# Dali - Getting Started

## Prerequisites

## Running dreemgl applications in Dali

```
node server.js -width 600 -height 600 -dali examples/nulltest
```
| Option  |          | Description                                                         |
| ------- | -------- | ------------------------------------------------------------------- |
| width   | Optional | Width of dali stage. default = 1920 pixels |
| height  | Optional | Height of dali stage. defualt = 1080 pixels |
| name    | Optional | Window name to display |
| dali    | Required | Location of the dreemgl application to run. This can be the name of a directory containing the application, or the name of a single javascript file (without the ```.js``` suffix)
| dalilib | Optional | Path to the dali/nodejs library. Default = ```/home/dali/teem/src/dreemgl/Release/dali```

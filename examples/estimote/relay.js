define.class('$server/service', function() {

    this.attributes = {
        // Current list of beacons visible with the repeater
        // Clients will see the all the visible beacons regardless of when they joined.
        beacons: Config({type: Object, value: {}, flow:'out'}),

        // Most recent list of changes to the beacon attribute sent from the server
        // Clients will only see the latest changes added since they join.
        changes: Config({type:Array, value:[], flow:'out'}),

        // Keep track of usage by device. The key is the device uuid and the
        // value is a hash of beacon_uuid to the beacon data. Old data is removed
        // from the structure.
        device_data: Config({type:Object, value:{}}),

        // Keep track of usage by beacon id. The key is the beacon id and the value
        // is a hash of device_uuid to the beacon data. Old data is removed
        // from the structure.
        beacon_data: Config({type:Object, value:{}})
    };

    this.init = function() {
        setInterval(this.expire_beacon_data, 10000);
    };

    // Keep track of location by device and beacon.
    // The beacon_id is the concatenation of the uuid and major and minor number.
    this.postBeacons = function(json) {
         // Use the server timestamp, not the timestamp received from device
        var ts = Date.now();

        var device = json['device'];
        var device_uuid = device['platform'] + ':' + device['uuid'];

        var beacons = json['beacons'];
        for (var beacon_id in beacons) {
            var beacon = beacons[beacon_id];
            var beacon_uuid = beacon['proximityUUID'] + ':' + beacon['major'] + ':' + beacon['minor'];

            // Create an array for each beacon and device, as needed
            if (!(beacon_uuid in this.beacon_data)) {
                this.beacon_data[beacon_uuid] = {};
            }

            if (!(device_uuid in this.device_data)) {
                this.device_data[device_uuid] = {};
            }

            // Store the same record for both beacon and device structures.
            this.beacon_data[beacon_uuid][device_uuid] = {ts: ts, device_uuid: device_uuid, beacon_uuid: beacon_uuid, beacon: beacon};
            this.device_data[device_uuid][beacon_uuid] = {ts: ts, device_uuid: device_uuid, beacon_uuid: beacon_uuid, beacon: beacon};
            //xxx set some last ts value changed
        }

        this.expire_beacon_data();

        this.findChanges();

        return this.beacons;
    };

    this.expire_beacon_data = function(age) {
        age = age || 20000;

        var ts = Date.now();

        var device_uuid, beacon_uuid, delta;
        for (beacon_uuid in this.beacon_data) {
            for (device_uuid in this.beacon_data[beacon_uuid]) {
                delta = ts - this.beacon_data[beacon_uuid][device_uuid]['ts'];
                if (delta > age) {
                    delete this.beacon_data[beacon_uuid][device_uuid];
                    if (Object.keys(this.beacon_data[beacon_uuid]).length == 0) {
                        delete this.beacon_data[beacon_uuid]
                    }
                }
            }
        }

        for (device_uuid in this.device_data) {
            for (beacon_uuid in this.device_data[device_uuid]) {
                delta = ts - this.device_data[device_uuid][beacon_uuid]['ts'];
                if (delta > age) {
                    delete this.device_data[device_uuid][beacon_uuid];
                    if (Object.keys(this.device_data[device_uuid]).length == 0) {
                        delete this.device_data[device_uuid]
                    }
                }
            }
        }
    };


    this.checkMovement = function(distances) {
        if (distances.length < 4) {
            return 0.0;
        }

        var median1 = distances.slice(0,3).sort()[1];
        var median2 = distances.slice(1,4).sort()[1];

        return median2 - median1
    };

    // Find intersection of current and previous beacons.
    this.intersection = function intersection(a, b) {
        var ai=0, bi=0;
        var result = [];

        while (ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                ai++;
            } else if (a[ai] > b[bi] ) {
                bi++;
            } else {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }

        return result;
    };

    this.findChanges = function() {

        var changelist = [];

        // Unroll the data into a single hash of beacon|device => data
        // To smooth the data (it can be pretty noisy), a distances array of the
        // previous 3 values is maintained, and the median value is selected.
        var unrolled = {};
        for (var beacon_id in this.beacon_data) {
            if (this.beacon_data.hasOwnProperty(beacon_id)) {
                var devices = this.beacon_data[beacon_id];
                for (var device_id in devices) {
                    if (devices.hasOwnProperty(device_id)) {
                        var id = beacon_id + '||' + device_id;
                        unrolled[id] = devices[device_id];
                    }
                }
            }
        }

        var both = this.intersection(Object.keys(unrolled), Object.keys(this.beacons));

        for (var key in unrolled) {
            if (unrolled.hasOwnProperty(key)) {
                var data = unrolled[key];
                var distance_current = data.beacon.distance;
                if (key in both) {
                    // Get the median distance stored (uses a clone of the object)
                    var distances = this.beacons[key].distances.slice(0);

                    distances.push(distance_current);
                    if (distances.length > 4) {
                        distances.shift();
                    }
                    var movement = 0.0;
                    if (distances.length >= 4) {
                        movement = this.checkMovement(distances)
                    }

                    // See if the distance has changed
                    if (movement <= -0.9) {
                        // Distance is smaller than before
                        unrolled[key].distances = [distance_current];
                        data.distances = distances;
                        changelist.push({change: '+movement', movement: movement, data: data})
                    } else if (movement >= 0.9) {
                        // Distance is greater than before
                        unrolled[key].distances = [distance_current];
                        data.distances = distances;
                        changelist.push({change: '-movement', movement: movement, data: data})
                    } else {
                        // Add the distance to the array
                        unrolled[key].distances = distances
                    }
                } else {
                    unrolled[key].distances = [distance_current];
                    changelist.push({change: 'enter', data: data})
                }
            }
        }

        for (var k in this.beacons) {
            if (this.beacons.hasOwnProperty(k)) {
                if (!(k in both)) {
                    changelist.push({change: 'leave', data: data})
                }
            }
        }

        this.changes = changelist;
        this.beacons = unrolled;
    };

});
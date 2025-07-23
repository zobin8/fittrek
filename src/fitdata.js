const axios = require('axios');
const User = require('../models/users')

async function syncRange(user, start, stop) {
    var distance = 0.0
    return 0;
    await axios({
        method: "POST",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        headers: {
            "Content-Type": "application/json;encoding=utf-8",
            "Authorization": "Bearer " + user.token
        },
        data: {
            aggregateBy: [{
                "dataTypeName": "com.google.distance.delta",
                "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta"
            }],
            bucketByTime: { "durationMillis": stop - start },
            startTimeMillis: start,
            endTimeMillis: stop
        }
    }).then(async function (res) {
        res.data.bucket.forEach(function (item) {
            item.dataset.forEach(function (data) {
                data.point.forEach(function (point) {
                    point.value.forEach(function (value) {
                        if (value.fpVal) {
                            distance += value.fpVal;
                        }
                    })
                })
            });
        });
    }).catch(function (err) {
        console.log(err);
        console.log(err.response.data.error);
    });

    return distance;
}

const sync = async function(user) {
    const now = Date.now() - 14400000;
    var last = user.lastsync > 0 ? user.lastsync : now - 86400000;
    var distance = 0.0;

    if (last + 14400000 > now) {
        return;
    }

    while (now > last) {
        let next = Math.min(now, last + 864000000)
        let synced = await syncRange(user, last, next)
        distance += synced
        last = next
    }

    var newTotal = user.distance + Math.round(distance);
    user.distance = newTotal;
    await User.findOneAndUpdate({openid: user.openid}, {distance: newTotal, lastsync: now});    
}

exports.sync = sync;

const axios = require('axios');
const User = require('../models/users')

async function syncTotal(user) {
    var distance = 0.0

    await axios({
        method: "GET",
        url: `https://api.fitbit.com/1/user/${user.openid}/activities.json`,
        headers: {
            "Content-Type": "application/json;encoding=utf-8",
            "Authorization": "Bearer " + user.token,
            "Accept": "application/json"
        },
    }).then(async function (res) {
        var total_m = (res?.data?.lifetime?.total?.distance || 0) * 1000;
        distance = Math.max(0, total_m - user.total_distance);
        console.log(res.data.lifetime.total);
    }).catch(function (err) {
        console.log(err);
        console.log(err.response.data.error);
    });

    return distance;
}

const sync = async function(user) {
    var distance = await syncTotal(user);

    await User.findOneAndUpdate(
        {openid: user.openid},
        {distance: user.distance + distance, total_distance: user.total_distance + distance}
    );
}

exports.sync = sync;

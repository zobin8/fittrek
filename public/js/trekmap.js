function drawPath(ctx, data, dist) {
    var pts = data.checkpoints;
    var i;

    for (i = 0; i < pts.length; i++) {
        if (pts[i].dist > dist) break;
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, ctx.lineWidth / 2 + 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (i = 1; i < pts.length; i++) {
        if (pts[i].dist > dist) {
            var ratio = (dist - pts[i - 1].dist) / (pts[i].dist - pts[i - 1].dist);
            var x = (pts[i].x - pts[i - 1].x) * ratio + pts[i - 1].x;
            var y = (pts[i].y - pts[i - 1].y) * ratio + pts[i - 1].y;
            ctx.lineTo(x, y);
            break;
        }
        ctx.lineTo(pts[i].x, pts[i].y);
    }    
    ctx.stroke();
}

function loadtrek(name, data) {
    var c = document.getElementById('map-' + name);
    var ctx = c.getContext("2d");

    ctx.lineWidth = c.getAttribute("width") / 50;
    ctx.strokeStyle = "#343a40";
    ctx.fillStyle = ctx.strokeStyle;
    drawPath(ctx, data, data.dist);

    ctx.lineWidth /= 2;
    if (data.currdist && data.currdist < data.dist) {
        ctx.strokeStyle = "#17a2b8";
        ctx.fillStyle = ctx.strokeStyle;
        drawPath(ctx, data, data.apply + data.currdist);
        
        ctx.strokeStyle = "#007bff";
        ctx.fillStyle = ctx.strokeStyle;
        drawPath(ctx, data, data.currdist);
    } else if (data.currdist) {
        ctx.strokeStyle = "#ffc107";
        ctx.fillStyle = ctx.strokeStyle;
        drawPath(ctx, data, data.currdist);
    }
}

/* exported loadone */
function loadone(name) {
    $.get("/trek/data/" + name, function(data) {
        loadtrek(name, data);
    });
}

/* exported loadall */
function loadall() {
    $.get("/trek/data-all", function(data) {
        for (let trek in data) {
            loadtrek(trek, data[trek]);
        }
    });
}

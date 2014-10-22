var paused = false;

var hw = 0, hh = 0;
var pCount=34;
var midiappyNo=pCount/2;
var mouseCursor=false;

var scene1;
var activeScene;

var position = {
    "a":{"tl":{"x":40, "y":40},  "tr":{"x":1520, "y":40},  "bl":{"x":40, "y":320}, "br":{"x":1520, "y":320}},
    "b":{"tl":{"x":40, "y":680}, "tr":{"x":880, "y":680},  "bl":{"x":40, "y":960}, "br":{"x":880, "y":960}},
    "c":{"tl":{"x":40, "y":360}, "tr":{"x":1520, "y":360}, "bl":{"x":40, "y":640}, "br":{"x":1520, "y":640}}
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var innerW=ctx.canvas.width, innerH=ctx.canvas.height;
var width=ctx.canvas.width, height=ctx.canvas.height;
var maxD={"x":1.0*innerW, "y":1.0*innerH};
var direction={"x":1, "y":1};

var nico_c = document.getElementById("nico_c");
var nico_ctx = nico_c.getContext("2d");

var nico_e = document.getElementById("nico_e");
var nico_e_ctx = nico_e.getContext("2d");

setTimeout(function() {

    CanvasRenderingContext2D.prototype.clear = function() {
        this.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.beginPath();
        this.fillStyle="#000000";
        this.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.closePath();
        this.fill();
    };
    CanvasRenderingContext2D.prototype.updateFps = function() {
        var d = new Date();
        var s = d.getSeconds();
        
        if (s != this.lastsecond) {
            this.lastsecond = s;
            this.fps = this.fpsc;
            this.fpsc = 0;
        } else {
            this.fpsc++;
        }
    };
    CanvasRenderingContext2D.prototype.showFps = function(x, y) {
        if (this.fps != undefined) {
            this.fillStyle = 'silver';
            this.fillText(this.fps + " fps", x, y);
        }
    };
    
    
    hw = width / 2;
    hh = height / 2;
    
    //ctx.canvas.width = width;
    //ctx.canvas.height = height;
    
    scene1 = new Scene(pCount, hw, hh);
    activeScene = scene1;
    
    setTimeout(running, 100);
        
}, 100);

// load midiappy
var img=new Image();
img.src="images/midiappy.png";
var midiappy_loaded=false;
img.addEventListener("load", function(){
    midiappy_loaded=true;
});

mouseEmu();
var fPos={"x":{"fix":[1000, 2320, 3220, 2320], "count":0}};
function mouseEmu() {
    setTimeout(function(){
        if(typeof scene1!="undefined") {
            if(rand(100)<40) {
                for(var i=0; i<rand(1); i++) {
                    scene1.blast();
                    console.log("[blasted]");
                }
            }

            var limit={"x":200, "y":0};
            scene1.mx=fPos.x.fix[fPos.x.count++%fPos.x.fix.length];
            if(fPos.x.count>1000)fPos.x.count=0;
            scene1.my=height/2;
            
            if(mouseCursor==true) {
                // mx, my: mouse x or y 
                ctx.beginPath();
                var bc=ctx.fillStyle;
                ctx.fillRect(scene1.mx, scene1.my, 100, 100);
                ctx.fillStyle="#ffffff";
                ctx.fill();
                ctx.fillStyle=bc;
                ctx.closePath();
            }
        }
        mouseEmu();
    }, 4850+(rand(2)==1?1:-1)*1*Math.random());
}

function running(){
    if(paused){
        setTimeout(running, 100);
    } else {
        ctx.clear();
        //ctx.showFps(width - 70, 10);
        scene1.frame();
        ctx.updateFps();
        setTimeout(running, 40); // default:80 update timing
    }
}
function Scene(max, mx, my) { // max:particle count
    var max = max, pts = new Array(max);
    
    this.mx = mx;
    this.my = my;
    
    this.bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    this.behavior = 1;
    this.status = 1;
    
    this.frame = function() {
        for (var i = 0; i < pts.length; i++) {
            
            if (pts[i] == null) {
                var size = rand(5) + 30;
                pts[i] = {
                    x: width/2+(rand(2)==1?1:-1)*rand(width), y: height/2+(rand(2)==1?1:-1)*rand(100),
                    size: size, hsize: size / 2, r: 10, a: Math.PI,
                    speed: Math.random() + 0.5,
                    kx: 0, ky: 0, frame: rand(20) + 10, 
                    color: new Color(rand(200) + 55, rand(200) + 55, rand(200) + 55, rand(5) / 10 + 0.2),
                    direct: {"x": 1, "y":1}
                };
                if(i==midiappyNo) {
                    pts[i]["x"]=width/2+(rand(2)==1?1:-1)*(100+rand(100));
                    pts[i]["y"]=height/2;
                }
                pts[i].backupa = pts[i].color.a;
            }
            
            var pt = pts[i];
            
            var ox = (this.mx - pt.x);
            var oy = (this.my - pt.y);
            
            var oa = Math.atan2(ox, oy);
            
            var minx = Math.sin(pt.a) * pt.speed * 2;
            var miny = Math.cos(pt.a) * pt.speed * 2;
            
            var t=1;
            if(i==midiappyNo) {
                t=0.0005;
            }
            pt.kx += Math.sin(oa) + minx * 0.05;
            pt.ky += Math.cos(oa) + t * miny * 0.05;
            
            pt.a = (pt.a + 0.1 * pt.speed) % (Math.PI * 2);
            
            pt.x += pt.direct.x * (ox) * 0.01 + pt.kx;
            pt.y += pt.direct.y * (oy) * 0.01 + pt.ky;

            pt.size = 18 + Math.sin(pt.a) * 5;
            pt.sizem = 0.6*pt.size;
            
            if(i==midiappyNo/*Math.floor(pts.length/2)*/) {
                drawPtm(pt);
            } else {
                drawPt(pt);
            }
        }

        
        var nico_c={
            "d-l": ctx.getImageData(   0, 0,  420, 280),
            "c":   ctx.getImageData( 420, 0, 1480, 280),
            "b":   ctx.getImageData(1900, 0,  840, 280),
            "a":   ctx.getImageData(2740, 0, 1480, 280),
            "d-r": ctx.getImageData(4220, 0,  420, 280),
            "f":   ctx.getImageData(2580, 0,  160, 280),
            "e":   ctx.getImageData(1900, 0,  160, 280)

        };

        nico_ctx.putImageData(nico_c["d-r"], 920, 680);
        nico_ctx.putImageData(nico_c["c"], 40, 360);
        nico_ctx.putImageData(nico_c["b"], 40, 680);
        nico_ctx.putImageData(nico_c["a"], 40, 40);
        nico_ctx.putImageData(nico_c["d-l"], 1340, 680);
        nico_ctx.putImageData(nico_c["e"], 1560, 360);
        nico_ctx.putImageData(nico_c["f"], 1560, 40);

        var imCanvas=document.createElement("canvas");
        var imCtx=imCanvas.getContext("2d");
        imCanvas.width=700, imCanvas.height=700;
        imCtx.putImageData(nico_c["b"], 0, 0);
        imCtx.transform(1, 0.1, 0, 1, 50, 50);
        nico_e_ctx.drawImage(imCanvas, 20, 20);
    };
    
    this.blast = function() {
        for (var i = 0; i < pts.length; i++) {
            if(typeof pts[i] !="undefined" && typeof pts[i] !="undefined" ) {
                pts[i].kx *= 1.4;
                if(i!=midiappyNo) pts[i].ky *= 1.005;
            }
        }
    };
}

function drawPt(pt) {
    ctx.beginPath();
    if (pt.frame > 0) {
        pt.frame--;
        pt.color.a = pt.backupa;
        ctx.arc(pt.x - pt.hsize, pt.y - pt.hsize, pt.size, 2 * Math.PI, false);
    }
    else {
        pt.frame = rand(20) + 40;
        pt.color.a = 1;
        ctx.arc(pt.x - pt.hsize - 2, pt.y - pt.hsize - 2, pt.size + 4, 2 * Math.PI, false);
    }
    ctx.fillStyle = pt.color.rgba();
    ctx.closePath();
    ctx.fill();
    
}
var rotate=0.001;
function drawPtm(pt) {
    var scale=pt.sizem;
    if(rand(100)<40) {
        if(Math.random() > 0.3) {
            rotate=0.2*(Math.random() > 0.5 ? 1 : -1) * Math.random();
        }
    }

    ctx.beginPath();
    if (pt.frame > 0) {
        pt.frame--;
        pt.color.a = pt.backupa;
        ctx.globalAlpha = updateOpacity(scale*pt.size);;
        // (1) 原点書きたい場所に移動
        // (2) 回転
        // (3) 画像の半分をづらして描画
        ctx.translate(pt.x, pt.y);
        ctx.rotate(rotate);
        ctx.drawImage(img, -1*scale*pt.size/2, -1*scale*pt.size/2, scale*pt.size, scale*pt.size);
        ctx.rotate(-1*rotate);
        ctx.translate(-1*(pt.x), -1*(pt.y));
        ctx.globalAlpha = 1;
    } else {
        pt.frame = rand(20) + 40;
        pt.color.a = 1;
        ctx.globalAlpha = updateOpacity(scale*pt.size);;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(rotate);
        ctx.drawImage(img, -1*scale*pt.size/2, -1*scale*pt.size/2, scale*pt.size, scale*pt.size);
        ctx.rotate(-1*rotate);
        ctx.translate(-1*(pt.x), -1*(pt.y));
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = pt.color.rgba();
    ctx.fill();
    ctx.closePath();
}

var op=1, ddd=1;
function updateOpacity(val) {
    if(op>=1) {
        ddd=-1;
    } else if(op<=0.5) {
        ddd=1;
    }
    op+=ddd*Math.random()*0.1;
    return op;
};


/* nico farre configuration */
var lastpos="a";
function checkPos(x, y, d) {
    for(key in position) {
        var po=position[key];
        var jj={"x":false, "y":false};
        if(x>po.tl.x && x<=po.tr.x) {
            jj.x=true;
        }
        if(y>po.tl.y && y<=po.bl.y) {
            jj.y=true;
        }
        if(jj.x && jj.y==true) {
//            console.log("[pos] ",key);
        } else {
//            console.log("[pos] out");
        }
        /*
        if(x>po.tl.x && x<=po.tr.x) {
            if(y>po.tl.y && y<=po.bl.y) {
                console.log("[pos] ",key);
                break;
            }
        }
        */
    }
}
function fillBGround(c) {
    c.shadowBlur = 0;
    c.beginPath();
    c.fillStyle="rgba(0, 0, 0, 1)";
    c.fillRect(0, 0, wSize.width, wSize.height);
    c.fill();
}
function drawNicoFrame(c){
    c.beginPath();
    c.strokeStyle="rgba(255, 255, 255, 1)";
    c.fillStyle="rgba(100, 100, 100, 1)";
    c.fillRect(20, 20, 1520, 320); // A: right
    c.fillRect(20, 340, 1520, 320); // C: left
    c.fillRect(20, 660, 880, 320); // B: stage
    c.fillRect(900, 660, 880, 320); // D: back
    c.fillRect(1540, 20, 200, 320); // E: stage right
    c.fillRect(1540, 340, 200, 320); // F: stage left
    c.fillRect(1740, 20, 138, 210); // Ceiling
//    c.strokeRect(20, 20, 1520, 320); // A: right
//    c.strokeRect(20, 340, 1520, 320); // C: left
//    c.strokeRect(20, 660, 880, 320); // B: stage
//    c.strokeRect(900, 660, 880, 320); // D: back
//    c.strokeRect(1540, 20, 200, 320); // E: stage right
//    c.strokeRect(1540, 340, 200, 320); // F: stage left
//    c.strokeRect(1740, 20, 138, 210); // Ceiling
    c.fill();
    
    // real reasion
/*
    c.fillStyle="rgba(0, 0, 0, 1)";
    c.fillRect(40, 40, 1480, 280); // A: right
    c.fillRect(40, 360, 1480, 280); // A: right
    c.fillRect(40, 680, 840, 280); // B: stage
    c.fillRect(920, 680, 840, 280); // D: back
    c.fillRect(1560, 40, 160, 280); // E: stage right
    c.fillRect(1560, 360, 160, 280); // F: stage left
    c.fillRect(1760, 40, 98, 170); // Ceiling
    c.fill();
*/
    }
/* nico farre configuration */


/* code sample */
function rotateMidiappy() {
    if(load_done==true) {
            conole.log("rotate");
            var imgSize=500;
            ctx.translate(300, 300);
            ctx.drawImage(img, -1*imgSize/2, -1*imgSize/2, imgSize, imgSize);
            
            ctx.rotate(0.5);
            
            // render
            ctx.drawImage(img, -1*imgSize/2, -1*imgSize/2, imgSize, imgSize);
            
            // back translation
            ctx.rotate(-1*angle*Math.PI/180);
            ctx.translate(-300, -300);
            
    }
}


function Color(r,g,b,a){
    this.r=r;
    this.g=g;
    this.b=b;
    this.a=a;
    this.rgba = function() {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    };
}

function Rect(x,y,width,height){
    this.x=x;this.y=y;this.width=width;this.height=height;
    this.Right = function() { return this.x+this.width;};
    this.Bottom = function() { return this.x+this.height;};
}
function rand(max) { return Math.round(Math.random() * max); }




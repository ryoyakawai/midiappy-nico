var paused = false;
var frame_update=140; // default:80 update timing (speed)
/* configuration for initializing particles position */
var lastUpdatedTime=getUnixTime(), drawPositionInterval=300; // sec
function forceUpdateParticlePosition(){
    lastUpdatedTime=getUnixTime()-drawPositionInterval-100;
}
var deltaMoveRate=0.05;

var hw = 0, hh = 0;
var pCount=54;
var midiappyNo=pCount/2;
var mouseCursor=false;
var w3cNo=1+pCount/2;

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
    
    scene1 = new Scene(pCount, hw, hh);
    activeScene = scene1;
    
    setTimeout(running, 100);
}, 100);



// load midiappy
var midiappySlot={
    "path": ["images/00.png", "images/01.png", "images/02.png", "images/03.png", "images/04.png", "images/05.png","images/06.png", "images/07.png", "images/08.png"],
    "img": [],
    "ready" :[],
    "opacity":0.4,
    "rotate":0.001,
    "rotateD":1,
    "yDirection": 1
};
for(var i=0; i<midiappySlot.path.length; i++) {
    midiappySlot.img[i]=new Image();
    midiappySlot.img[i].src=midiappySlot.path[i];
    midiappySlot.img[i].id="midiapi_"+i;
    midiappySlot.img[i].addEventListener("load", function(event){
        midiappySlot.ready[event.target.id.replace(/midiapi_/, '')]=true;
    });
}
var img=new Image();
img.src="images/00.png"; //images/00.png";
var midiappy_loaded=false;
img.addEventListener("load", function(){
    midiappy_loaded=true;
});

// load w3c logo
var w3cSlot={
    "path": ["images/w3c_00.png", "images/w3c_01.png"],
    "img": [],
    "ready" :[],
    "opacity":0.1,
    "rotate":0.001,
    "rotateD":1,
    "yDirection": 1
};
var imgw3c=new Image();
for(var i=0; i<w3cSlot.path.length; i++) {
    w3cSlot.img[i]=new Image();
    w3cSlot.img[i].src=w3cSlot.path[i];
    w3cSlot.img[i].id="w3c_"+i;
    w3cSlot.img[i].addEventListener("load", function(event){
        w3cSlot.ready[event.target.id.replace(/w3c_/, '')]=true;
    });
    w3cSlot.opacity[i]=0.4;
}
imgw3c.src="images/w3c_00.png";


//mouseEmu();
var fPos={"x":{"fix":[1000, 2320, 3320, 2320], "count":0}};
function mouseCenter() {
    console.log("[Mouse Emulated at Center]");
    if(typeof scene1!="undefined") {
        if(rand(100)<40) {
            for(var i=0; i<rand(1); i++) {
                scene1.blast();
                console.log("[blasted]");
            }
        }
        
        scene1.mx=2320;
        scene1.my=height/2;
        
        if(mouseCursor==true) {
            // mx, my: mouse x or y 
            ctx.beginPath();
            var bc=ctx.fillStyle;
            ctx.fillRect(scene1.mx, scene1.my, 100, 100);
            ctx.fillStyle="#ff0000";
            ctx.fill();
            ctx.fillStyle=bc;
            ctx.closePath();
        }
    }
}
//////////
function mouseEmu2() {
    setTimeout(function(){
        if(typeof scene1!="undefined") {
            if(rand(100)<40) {
                for(var i=0; i<rand(1); i++) {
                    scene1.blast();
                    console.log("[blasted]");
                }
            }

            var limit={"x":20, "y":0};
            scene1.mx=fPos.x.fix[fPos.x.count++%fPos.x.fix.length];
            if(fPos.x.count>1000)fPos.x.count=0;
            scene1.my=height/2;
            
            if(mouseCursor==true) {
                // mx, my: mouse x or y 
                ctx.beginPath();
                var bc=ctx.fillStyle;
                ctx.fillRect(scene1.mx, scene1.my, 100, 100);
                ctx.fillStyle="#ff0000";
                ctx.fill();
                ctx.fillStyle=bc;
                ctx.closePath();
            }
        }
        mouseEmu();
    }, 20000);
}

function changeDeltaMoveRate(type) {
    switch(type) {
      case "down":
        if(deltaMoveRate>0.0005) {
            deltaMoveRate-=0.001;
        }
        break;
      case "up":
        if(deltaMoveRate<0.5) {
            deltaMoveRate+=0.001;
        }
        break;
    }
    return parseInt(1000*deltaMoveRate)/1000;
}

function changeSpeed(type) {
    switch(type) {
      case "down":
        if(frame_update<400) {
            frame_update+=5;
        }
        break;
      case "up":
        if(frame_update>60) {
            frame_update-=5;
        }
        break;
    }
    return frame_update;
}

function running(){
    if(paused){
        setTimeout(running, 5000);
    } else {
        ctx.clear();
        var options={"initDraw":false};
        if(getUnixTime()-lastUpdatedTime>drawPositionInterval) {
            lastUpdatedTime=getUnixTime();
            options={"initDraw":true};
        }
        scene1.frame(options);
        ctx.updateFps();
        setTimeout(running, frame_update); // update timing (speed)
    }
}
function Scene(max, mx, my) { // max:particle count
    var max = max, pts = new Array(max);
    
    this.mx = mx;
    this.my = my;
    
    this.bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    this.behavior = 1;
    this.status = 1;
    
    this.frame = function(options) {
        for (var i = 0; i < pts.length; i++) {
            if (pts[i] == null || options.initDraw===true) {
                console.log("<SCRIPT> [Initialized particles position]");
                var size = rand(5) + 30;
                pts[i] = {
                    x: width/2+(rand(2)==1?1:-1)*rand(width), y: height/2+(rand(2)==1?1:-1)*rand(100),
                    size: size, hsize: size / 2, r: 10, a: Math.PI,
                    speed: Math.random() * 0.005,
                    kx: 0, ky: 0, frame: rand(20) + 10, 
                    color: new Color(rand(200) + 55, rand(200) + 55, rand(200) + 55, rand(5) / 10 + 0.2),
                    direct: {"x": 1, "y":1}
                };
                if(i==midiappyNo) {
                    //pts[i]["x"]=width/2+(rand(2)==1?1:-1)*(100+rand(100));
                    pts[i]["x"]=3000;
                    pts[i]["y"]=height/2;
                }
                if(i==w3cNo) {
                    //pts[i]["x"]=width/2+(rand(2)==1?1:-1)*(100+rand(100))+200;
                    pts[i]["x"]=500;
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
            if(i==midiappyNo || i==w3cNo) {
                t=0.0005;
            }
            pt.kx += Math.sin(oa) + minx * 0.05;
            pt.ky += Math.cos(oa) + t * miny * 0.05;
            
            pt.a = (pt.a + 0.1 * pt.speed) % (Math.PI * 2);
            
            pt.x += deltaMoveRate * (pt.direct.x * (ox) * 0.01 + pt.kx);
            pt.y += deltaMoveRate * (pt.direct.y * (oy) * 0.01 + pt.ky);

            pt.size = 18 + Math.sin(pt.a) * 5;
            pt.sizem = 0.8*pt.size;
            
            if(i==midiappyNo /* Math.floor(pts.length/2) */) {
                drawPtm(pt, "midiappy");
            } else if(i==w3cNo){
                drawPtm(pt, "w3c");
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
                if(i!=midiappyNo || i!=w3cNo) {
                    pts[i].ky *= 1.05;
                }
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
function drawPtm(pt, type) {
    var scale=pt.sizem;
    if(rand(100)<40) {
        if(Math.random() > 0.4) {
            // rotate midiappy
            if(midiappySlot.rotate>0.2) midiappySlot.rotateD=-1;
            if(midiappySlot.rotate<-0.2) midiappySlot.rotateD=1;
            midiappySlot.rotate+=midiappySlot.rotateD * 0.02 * Math.random();

            // rotate w3c logo
            if(w3cSlot.rotate>0.2) w3cSlot.rotateD=-1;
            if(w3cSlot.rotate<-0.2) w3cSlot.rotateD=1;
            w3cSlot.rotate+=w3cSlot.rotateD * 0.02 * Math.random();
        }
    }

    ctx.beginPath();
    if (pt.frame > 0) {
        pt.frame--;
        pt.color.a = pt.backupa;
        //ctx.globalAlpha = updateOpacity("midiappy");
        //if(ctx.globalAlpha<=0.1 && rand(10) < 7) {
        ctx.globalAlpha = midiappySlot.opacity;
        switch(type) {
          case "midiappy":
            var imgNum=rand(midiappySlot.path.length-1);
            if(midiappySlot.ready[imgNum]===true) {
                midiappySlot.img[imgNum].style.opacity=updateOpacity("midiappy");
                if(midiappySlot.opacity<=0.15 && rand(10) < 8) {
                    img=midiappySlot.img[imgNum];
                }
            }
            break;
          case "w3c":
            var imgNum=rand(w3cSlot.path.length-1);
            if(w3cSlot.ready[imgNum]===true) {
                w3cSlot.img[imgNum].style.opacity=updateOpacity("w3c");
                if(w3cSlot.opacity<=0.15 && rand(10) < 7) {
                    imgw3c=w3cSlot.img[imgNum];
                }
            }
            break;
        }
        // (1) 原点書きたい場所に移動
        // (2) 回転
        // (3) 画像の半分をづらして描画
        ctx.translate(pt.x, pt.y);
        switch(type) {
          case "midiappy":
            ctx.rotate(midiappySlot.rotate);
            ctx.drawImage(img, -1*scale*pt.size/2, -1*scale*pt.size/2, scale*pt.size, scale*pt.size);
            ctx.rotate(-1*midiappySlot.rotate);
            break;
          case "w3c":
            ctx.rotate(w3cSlot.rotate);
            ctx.drawImage(imgw3c, -1*scale*pt.size/2, -1*scale*pt.size/2, 130, 130);
            ctx.rotate(-1*w3cSlot.rotate);
            break;
        }
        ctx.translate(-1*(pt.x), -1*(pt.y));
        ctx.globalAlpha = 1;
    } else {
        pt.frame = rand(20) + 40;
        pt.color.a = 1;
        ctx.globalAlpha = midiappySlot.opacity;
        ctx.translate(pt.x, pt.y);
        if(type=="midiappy") {
            ctx.rotate(midiappySlot.rotate);
            ctx.drawImage(img, -1*scale*pt.size/2, -1*scale*pt.size/2, scale*pt.size, scale*pt.size);
            ctx.rotate(-1*midiappySlot.rotate);
        }
        if(type=="w3c") {
            ctx.rotate(w3cSlot.rotate);
            ctx.drawImage(imgw3c, -1*scale*pt.size/2, -1*scale*pt.size/2, 130, 130);
            ctx.rotate(-1*w3cSlot.rotate);
        }
        ctx.translate(-1*(pt.x), -1*(pt.y));
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = pt.color.rgba();
    ctx.fill();
    ctx.closePath();

    // mouse emulation
    //if(type=="midiappy"){ // || type=="w3c") {
    if(type=="w3c"){
        if(mouseEmued===false) {
            if( pt.x < 1160 || pt.x > 3480 ) {
                var num=rand(4)+1;
                while(num>0) {
                    mouseCenter();
                    num--;
                }
                mouseEmued=true;
            }
        } else {
            if( pt.x >= 1160 && pt.x <= 3480 ) {
                mouseEmued=false;
            }
        }
    }
}
var mouseEmued=false;
    
var op=1, ddd=1;
function updateOpacity(type) {
    var op;
    switch(type) {
      case "midiappy":
        op=midiappySlot.opacity;
        break;
      case "w3c":
        op=w3cSlot.opacity;
        break;
    }
    if(op>=1) {
        ddd=-1;
    } else if(op<=0.1) {
        ddd=1;
    }
    op+=ddd*Math.random()*0.05;
    switch(type) {
      case "midiappy":
        midiappySlot.opacity=op;
        break;
      case "w3c":
        w3cSlot.opacity=op;
        break;
    }
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
/*
function rotateMidiappy() {
    if(load_done==true) {
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
*/

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
function getUnixTime() {  return ~~(new Date/1000); }

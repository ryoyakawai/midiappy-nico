document.body.addEventListener("keydown", function(event){    
    switch(event.keyCode) {
      case 48: // pause/start : keycode=48, (key:0)
        paused=!paused;
        console.log("[stopped] ", event.keyCode);
        break;
      case 82: // initialize particles position : keycode=82, (key:r)
        forceUpdateParticlePosition();
        console.log("[initialize particles position] ", event.keyCode);
        break;
      case 70: // fullscreen : keycode=70, (key:f)
        document.body.webkitRequestFullscreen();
        console.log("[fullscreen] ", event.keyCode);
        break;
      case 71: // disp video : keycode=71, (key:g)
        if(videoRunning==false) {
            startDraw();
        } else {
            stopDraw();
        }
        console.log("[disp video] "+(videoRunning==true?"Start":"STOP"), event.keyCode);
        break;
      case 77: // emulated mouse cursor on : keycode=77, (key:m)
        mouseCursor=!mouseCursor;
        console.log("[display cursor] ", event.keyCode);
        break;
      case 88: // change mode : keycode=88, (key:x)
        if(document.getElementById("nico_c").style.display=="block") {
            document.getElementById("nico_c").style.setProperty("display", "none");
            document.getElementById("canvas").style.setProperty("display", "block");
        } else {
            document.getElementById("nico_c").style.setProperty("display", "block");
            document.getElementById("canvas").style.setProperty("display", "none");
        }
        console.log("[changed display format] ", event.keyCode);
        break;
      case 49: // speed down : keycode=49, (key:1)
        var out=changeDeltaMoveRate("down");
        console.log("[Delta X Down] " + out + " (default:0.065)");
        break;
      case 50: // speed up : keycode=50, (key:2)
        var out=changeDeltaMoveRate("up");
        console.log("[Delta X Up] " + out + " (default:0.065)");
        break;
      case 51: // speed down : keycode=51, (key:3)
        var out=changeSpeed("down");
        console.log("[FrameRate Down] " + out + " (default:120)");
        break;
      case 52: // speed up : keycode=52, (key:4)
        var out=changeSpeed("up");
        console.log("[FrameRate Up] " + out + " (default:120)");
        break;
    }
});

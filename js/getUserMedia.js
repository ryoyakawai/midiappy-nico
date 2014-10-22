var getUserMedia = navigator.getUserMedia ? 'getUserMedia' :
    navigator.webkitGetUserMedia ? 'webkitGetUserMedia' :
    navigator.mozGetUserMedia ? 'mozGetUserMedia' :
    navigator.msGetUserMedia ? 'msGetUserMedia' :
    undefined;

var localMediaStream, timerId;
var videoRunning=false;
var video=document.getElementById("video");
function startStream(elemId) {
    navigator[getUserMedia](
        {video:true, audio:false},
        function(stream) {
            localMediaStream=stream;
            video.src=window.URL.createObjectURL(localMediaStream);
            console.log(stream);
        },
        function(e) { console.error(e); }
    );
}

var vcanvas=document.getElementById("videocanvas");
var vctx=vcanvas.getContext("2d");
function draw() {
    nico_ctx.drawImage(video, 1560, 360, 160, 280);
    nico_ctx.drawImage(video, 1560, 40, 160, 280);
    timerId=requestAnimationFrame(function(){
        draw();
    });
}
function stopDraw() {
    cancelAnimationFrame(timerId);
    videoRunning=false;
}
function startDraw() {
    draw();
    videoRunning=true;
}

startStream("video");
startDraw();


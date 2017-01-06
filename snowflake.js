var mainApp = null;

window.addEventListener("load", fitToWindow);
window.addEventListener("load", initializeApp);
window.addEventListener("resize", fitToWindow);

document.ontouchstart = function(e){ e.preventDefault(); }

function mousemove(event) {
    if (mainApp)
        mainApp.mousemove({x:event.pageX, y:event.pageY});
	event.preventDefault();
}
function mouseup(event) {
    if (mainApp)
        mainApp.mouseup({x:event.pageX, y:event.pageY});
	event.preventDefault();
}
function mousedown(event) {
    if (mainApp)
        mainApp.mousedown({x:event.pageX, y:event.pageY});
	event.preventDefault();
}
function touchstart(event) {
	var touchobj = event.touches[0];
	if (mainApp)
		mainApp.mousedown({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)});
	event.preventDefault();
	event.cancelBubble = true;
}
function touchmove(event) {
	var touchobj = event.touches[0];
	if (mainApp)
		mainApp.mousemove({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)});
	event.preventDefault();
	event.cancelBubble = true;
}
function touchend(event) {
	var touchobj = event.touches[0];
	if (mainApp)
		mainApp.mouseup({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)});
	event.preventDefault();
	event.cancelBubble = true;
}

function fitToWindow() {
    var c = document.getElementById('mainCanvas');
    c.width = document.getElementById('container').offsetWidth;
    c.height = document.getElementById('container').offsetHeight;
    if (mainApp)
        mainApp.refresh();
}

function initializeApp() {
    mainApp = new MainApp(document.getElementById('mainCanvas'));
}

function MainApp(htmlCanvasElement) {
    var canvasElement = htmlCanvasElement;
    var width = canvasElement.offsetWidth;
    var height = canvasElement.offsetHeight;
    
    var mouseLocation = {x:0, y:0};
    var paintSegments = [];
    var currentSegment = null;
    
    function updateCanvas() {
        var ctx = canvasElement.getContext("2d");
        var width = canvasElement.offsetWidth;
        var height = canvasElement.offsetHeight;
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        
        var mainGuideHeight = height/1.2;
        var otherGuideHeight = height/2;
        
        // main guides
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        for (var i=0; i<180; i+=60) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            ctx.translate(width/2, height/2);
            ctx.rotate(i*Math.PI/180);
            ctx.moveTo(0, -mainGuideHeight/2);
            ctx.lineTo(0, mainGuideHeight/2);
            ctx.stroke();
        }            
        
        // other guides
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        for (var i=30; i<180; i+=60) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            ctx.translate(width/2, height/2);
            ctx.rotate(i*Math.PI/180);
            ctx.moveTo(0, -otherGuideHeight/2);
            ctx.lineTo(0, otherGuideHeight/2);
            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        // render paintSegments
        //ctx.strokeStyle = "#ffffff";
        for (var a=0; a<360; a+=60) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(width/2, height/2);
            ctx.rotate(a*Math.PI/180);
            for (var i=0; i<paintSegments.length; i++) {
					ctx.beginPath();
					ctx.strokeStyle = paintSegments[i].color;
					ctx.moveTo(paintSegments[i].points[0].x, paintSegments[i].points[0].y);
					for (var j=1; j<paintSegments[i].points.length; j++) {
						 ctx.lineTo(paintSegments[i].points[j].x, paintSegments[i].points[j].y);
					}
					ctx.stroke();
            }
            
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(width/2, height/2);
            ctx.rotate(a*Math.PI/180);
            for (var i=0; i<paintSegments.length; i++) {
					ctx.beginPath();
					ctx.strokeStyle = paintSegments[i].color;
					ctx.moveTo(-paintSegments[i].points[0].x, paintSegments[i].points[0].y);
					for (var j=1; j<paintSegments[i].points.length; j++) {
						 ctx.lineTo(-paintSegments[i].points[j].x, paintSegments[i].points[j].y);
					}
					ctx.stroke();
            }
        }
        
        // render cursors
        for (var i=0; i<360; i+=60) {
            if (i == 0)
                ctx.fillStyle = "rgba(255, 242, 220, 0.9)";
            else
                ctx.fillStyle = "rgba(255, 242, 220, 0.4)";
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            ctx.translate(width/2, height/2);
            ctx.rotate(i*Math.PI/180);
            ctx.arc(mouseLocation.x, mouseLocation.y, 3, 0, 2*Math.PI);
            ctx.fill();
        }
        
    }
    
   var refreshTimer = null;
	this.refresh = function() {
		clearTimeout(refreshTimer);
		refreshTimer = setTimeout(updateCanvas, 10);
	}
	updateCanvas();
    
	this.mousemove = function(pt) {
		pt = {x:pt.x - width/2, y:pt.y - height/2};
		mouseLocation = pt;

		if (isDragging) {
			if (!currentSegment) {
				currentSegment = new PaintSegment();
				paintSegments.push(currentSegment);
			}
			currentSegment.points.push(pt);
		}

		//this.refresh();
		updateCanvas();
	}
    
	var isDragging = false;
	this.mousedown = function(pt) {
		pt = {x:pt.x - width/2, y:pt.y - height/2};
		isDragging = true;
	}
    
	this.mouseup = function(pt) {
		pt = {x:pt.x - width/2, y:pt.y - height/2};
		isDragging = false;
		currentSegment = null;
	}
}

var ColorPalette = [
    "#10AAB4",
    "#ED2B46",
    "#EB7A6A",
    "#AACF31",
    "#14B37D"
];

function PaintSegment(color) {
	this.points = [];
	/*
	var idx = Math.ceil(Math.random() * ColorPalette.length);
	if (idx >= ColorPalette.length)
		idx = ColorPalette.length -1;
	this.color = ColorPalette[idx];
	*/
	this.color = "#ffffff";
}



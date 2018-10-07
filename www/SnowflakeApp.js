angular.module('app').service('SnowflakeApp', function() {
  function PaintSegment(color) {
    this.points = [];
    this.color = color;
  }

  return function MainApp(htmlCanvasElement, sides, color) {
    var activeColor = color;
    var canvasElement = htmlCanvasElement;
    var width = canvasElement.offsetWidth;
    var height = canvasElement.offsetHeight;

    var mouseLocation = {x:0, y:0};
    var paintSegments = [];
    var currentSegment = null;

    this.setActiveColor = function(col) {
      activeColor = col;
    }

    function updateCanvas() {
      var degree_interval = 360 / sides;

      var ctx = canvasElement.getContext("2d");
      var width = canvasElement.offsetWidth;
      var height = canvasElement.offsetHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      var mainGuideHeight = Math.min(width/1.1, height/1.1);
      var otherGuideHeight = Math.min(width/2, height/2);

      // main guides
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      for (var i=0; i<360; i+=degree_interval) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.translate(width/2, height/2);
        ctx.rotate(i*Math.PI/180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, mainGuideHeight/2);
        ctx.stroke();
      }

      // half guides
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      for (var i=degree_interval/2; i<360; i+=degree_interval) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.translate(width/2, height/2);
        ctx.rotate(i*Math.PI/180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, otherGuideHeight/2);
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // render paintSegments
      for (var a=0; a<360; a+=degree_interval) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(width/2, height/2);
        ctx.rotate(a*Math.PI/180);
        for (var i=0; i<paintSegments.length; i++) {
          ctx.beginPath();
          ctx.strokeStyle = paintSegments[i].color;
          ctx.lineWidth = paintSegments[i].weight * 3 + 1;
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
          ctx.lineWidth = paintSegments[i].weight * 3 + 1;
          ctx.moveTo(-paintSegments[i].points[0].x, paintSegments[i].points[0].y);
          for (var j=1; j<paintSegments[i].points.length; j++) {
            ctx.lineTo(-paintSegments[i].points[j].x, paintSegments[i].points[j].y);
          }
          ctx.stroke();
        }
      }

      // render cursors
      for (var i=0; i<360; i+=degree_interval) {
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

      _requestAnimationFrame(updateCanvas);
    }

    function _requestAnimationFrame(animate) {
      if (window.requestAnimationFrame) window.requestAnimationFrame(animate);
      else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(animate);
      else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(animate);
      else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(animate);
      else { console.error("Can't request animation frame"); }
    }
    _requestAnimationFrame(updateCanvas);

    this.mousemove = function(pt, force) {
      pt = {x:pt.x - width/2, y:pt.y - height/2, weight: force || 0 };
      mouseLocation = pt;

      if (isDragging && currentSegment) {
        currentSegment.points.push(pt);
      }
    }

    var isDragging = false;
    this.mousedown = function(pt) {
      currentSegment = new PaintSegment(activeColor);
      paintSegments.push(currentSegment);

      pt = {x:pt.x - width/2, y:pt.y - height/2, weight: 0 };
      currentSegment.points.push(pt);
      isDragging = true;
    }

    this.mouseup = function(pt) {
      pt = {x:pt.x - width/2, y:pt.y - height/2, weight: 0 };
      isDragging = false;
      currentSegment = null;
    }
  }
});

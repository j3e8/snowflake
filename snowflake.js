angular.module('app').controller('mainController', function($scope, SnowflakeApp) {
  var mainApp = null;

  $scope.colors = [
    '#ffffff',
    '#10AAB4',
    '#ED2B46',
    '#EB7A6A',
    '#AACF31',
    '#14B37D'
  ];

  $scope.sides = 6;
  $scope.activeColor = $scope.colors[0];

  $scope.$watch('sides', function() {
    initializeApp();
  });

  $scope.changeColor = function(col) {
    $scope.activeColor = col;
    if (mainApp) {
      mainApp.setActiveColor(col);
    }
  }

  $scope.fewerSides = function() {
    $scope.sides--;
    if ($scope.sides < 5) {
      $scope.sides = 5;
    }
  }

  $scope.moreSides = function() {
    $scope.sides++;
    if ($scope.sides > 13) {
      $scope.sides = 13;
    }
  }

  $scope.refresh = function() {
    initializeApp();
  }

  $scope.mousemove = function(event) {
    if (mainApp)
      mainApp.mousemove({x:event.pageX, y:event.pageY});
    event.preventDefault();
  }
  $scope.mouseup = function(event) {
    if (mainApp)
      mainApp.mouseup({x:event.pageX, y:event.pageY});
    event.preventDefault();
  }
  $scope.mousedown = function(event) {
    if (mainApp)
      mainApp.mousedown({x:event.pageX, y:event.pageY});
    event.preventDefault();
  }
  $scope.touchstart = function(event) {
    var touchobj = event.touches[0];
    if (mainApp && touchobj)
      mainApp.mousedown({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)});
    event.preventDefault();
    event.cancelBubble = true;
  }
  $scope.touchmove = function(event) {
    var touchobj = event.touches[0];
    if (mainApp && touchobj)
      mainApp.mousemove({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)}, touchobj.force);
    event.preventDefault();
    event.cancelBubble = true;
  }
  $scope.touchend = function(event) {
    var touchobj = event.touches[0];
    if (mainApp && touchobj)
      mainApp.mouseup({x:parseInt(touchobj.pageX),y:parseInt(touchobj.pageY)});
    event.preventDefault();
    event.cancelBubble = true;
  }

  function initializeApp() {
    mainApp = new SnowflakeApp(document.getElementById('mainCanvas'), $scope.sides, $scope.activeColor);
  }

  function fitToWindow() {
    var c = document.getElementById('mainCanvas');
    c.width = document.getElementById('container').offsetWidth;
    c.height = document.getElementById('container').offsetHeight;
    if (mainApp)
      mainApp.refresh();
  }

  window.addEventListener("resize", fitToWindow);

  fitToWindow();
  initializeApp();
});

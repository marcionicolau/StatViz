var variables = new Object();     
var variableTypes = new Object();
var IQR = new Object();   
var MIN = new Object();
var MAX = new Object();
var variableType = new Object();
var splitData = new Object();
var varNames = new Array();


var currentVariableSelection = [];    
    var currentVisualizationSelection = "Histogram"; // Select histogram by default
    
    
// Mouse events
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag	

// Significance test
var significanceTestScaleOffset = 25;

var testResults = new Object();
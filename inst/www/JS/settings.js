
var dataset = "mtcars";

var width = document.width;
var height = document.height;  

var panelColors = new Object();


var canvasHeight = height*(2/3);
var canvasWidth = width*0.8;      
      
// Define format for displaying text (this depends on the dataset)            
var format = d3.format(".1f");	

// Plots (general)
var size = 600;

// Histogram
var nBins = 10;   

// Boxplots
var boxWidth = 75;

panelColors.normal = "white";
panelColors.active = "darkgrey";

var axesOffset = 25;


//Define colors for histogram bars, color scatterplot
var colors = ["rgb(255,0,0)","rgb(0,255,0)","rgb(0,0,255)", "rgb(255,255,0)","rgb(0,255,255)","rgb(255,0,255)"];

var meanColors = new Object();
meanColors["normal"] = "purple";
meanColors["hover"] = "lightgreen";
meanColors["click"] = "green";

var intervals = new Object();

var histogramOpacity = 0.5;

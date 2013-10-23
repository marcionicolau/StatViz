// Data
var dataset = "mtcars";
var pathToFile = "/Users/krishnasubramanian/Documents/Coursera/Statistics One/Datasets/datafiles-Stats1.13.Lab.02.txt";

// Skeleton
var width = document.width;
var height = document.height;  

var panelColors = new Object();
    panelColors.normal = "white";
    panelColors.active = "darkgrey";

var canvasHeight = height*(2/3);
var canvasWidth = width*0.75; 

var visualizationImageSize = 200;     
      

// Plots (general)
var size = 400;
var axesOffset = 25; //distance from plots to axes (for an R-like appearance)

//Define colors for histogram bars, color scatterplot
var colors = ["rgba(255,0,0,0.5)","rgba(0,255,0,0.5)","rgba(0,0,255,0.5)", "rgba(255,255,0,0.5)","rgba(0,255,255,0.5)","rgba(255,0,255,0.5)"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "purple";
    meanColors["hover"] = "lightgreen";
    meanColors["click"] = "green";


// Histogram
var nBins = 10; 
var binCountFontSize = "16px";


// Boxplots
var boxWidth = 75;
var intervals = new Object(); //for keeping track of animations
var meanRadius = "5px";
var outlierRadius = "3px";

// Scatterplot
var datapointRadius = "3px";






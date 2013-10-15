var dataset = "longley";

var width = document.width;
var height = document.height;  

var canvasHeight = height*(2/3);
var canvasWidth = width*0.8;      
      
// Define format for displaying text (this depends on the dataset)            
var format = d3.format(".1f");	

// Plots (general)
var size = 500;

// Histogram
var nBins = 10;   

// Boxplots
var boxWidth = 75;

var variableColors = new Object();

variableColors.normal = "white";
variableColors.active = "darkgrey";



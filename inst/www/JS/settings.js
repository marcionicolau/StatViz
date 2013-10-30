// Data
var dataset = "mtcars";

var fileName = "cars-mod.txt";
var pathToFile = "/Users/krishnasubramanian/Documents/Media Informatics/Semester 4/Thesis/Implementation/Possible Datasets/Datasets/" + fileName;

// Skeleton
var width = document.width;
var height = document.height;  

var panelColors = new Object();
    panelColors.normal = "white";
    panelColors.active = "darkgrey";

var canvasHeight = height*(2/3);
var canvasWidth = width*0.75; 

var visualizationImageSize = 200;  
variableSelectionButtonWidth = 50;   
      

// Plots (general)
var size = 500;
var axesOffset = 25; //distance from plots to axes (for an R-like appearance)
var tickTextOffsetXAxis = 25;
var tickTextOffsetYAxis = 15;
var yAxisTickTextOffset = 6;
var fontSize = 14;
var tickLength = 10;


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
var datapointRadius = 3;
var numberOfGrooves = 10;

// Significance test
experimentalDesign = "between-groups";

var significanceTestScaleOffset = 25;
var assumptionsSpace = 30;
var assumptionImageSize = 30;
var assumptionsText = ["Homogeneity of variances", "Normality of distributions"]; //todo for others
var assumptions = ["homogeneity", "normality"];
var sampleSizeCutoff = 20;







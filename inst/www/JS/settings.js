// Data
var fileName;
localStorage.fileName = "cars";
var pathToFile = "http://hci.rwth-aachen.de/~subramanian/datasets/" + localStorage.fileName +".txt";

var experimentalDesign = "between-groups";

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
var axesOffset = 25; //distance from plots to axes (for an R-like appearance)
var tickTextOffsetXAxis = 25;
var tickTextOffsetYAxis = 10;
var yAxisTickTextOffset = 6;
var fontSize = 14;
var tickLength = 10;
var border = 20;

var plotHeight = canvasHeight - 2*(axesOffset + tickTextOffsetXAxis + border);
var plotWidth = 4*plotHeight/3;

// Buttons
var buttonColors = new Object();   
    buttonColors["normal"] = "white";
    buttonColors["hover"] = "lightgrey";
    buttonColors["click"] = "BlanchedAlmond";


//Define colors for histogram bars, color scatterplot
var colors = ["rgba(255,0,0,0.8)","rgba(0,255,0,0.6)","rgba(0,0,255,0.4)", "rgba(255,255,0,0.2)","rgba(0,255,255,0.25)","rgba(255,0,255,0.25)"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "purple";
    meanColors["hover"] = "lightgreen";
    meanColors["click"] = "green";

// Histogram
var nBins = 10; 
var binCountFontSize = "16px";
var histLegendOffsetX = 25;
var histLegendOffsetY = 35;
var histLegendSize = 35;


// Boxplots
var boxWidth = 75;
var intervals = new Object(); //for keeping track of animations
var meanRadius = "5px";
var outlierRadius = "3px";

var boxColors = new Object();
    boxColors["normal"] = "lightgrey";
    boxColors["notnormal"] = "crimson";

var CIFringeLength = 5;

// Scatterplot
var datapointRadius = 3;
var numberOfGrooves = 10;
var topOffset = 25;
var labelOffset = 45;

// Significance test

var significanceTestScaleOffset = 25;
var assumptionsSpace = 30;
var assumptionImageSize = 30;

var assumptionsText = new Object();
    assumptionsText["normality"] = "Normality of distributions";
    assumptionsText["homogeneity"] = "Homogeneity of variances";
    
var assumptions = ["normality", "homogeneity"];
var significanceTestResultOffset = 40;

//transformation
var normalityPlotWidth = 200;
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = 75; //from canvasHeight
var buttonOffset = 100;
var buttonHeight = 75;
var buttonWidth = 450;
var boxPlotTransformationDuration = 700;

var sampleSizeCutoff = 20;

//full screen button
var fullScreenButtonSize = 75;
var fullScreenButtonOffset = 15;








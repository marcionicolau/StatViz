// Data
    localStorage.fileName = "store";
    var fileName = "impact";//change this!
    var wd = "/Users/krishnasubramanian/Documents/Media Informatics/Semester 4/Thesis/Implementation/Possible Datasets/Datasets/";//"http://hci.rwth-aachen.de/~subramanian/datasets/" + localStorage.fileName +".txt";
    var pathToFile =  wd + "IMPACT.txt";

// Skeleton
    var width = document.width;
    var height = document.height;  

    var panelColors = new Object();
        panelColors.normal = "white";
        panelColors.active = "darkgrey";

    var canvasHeight = height*(2/3);
    var canvasWidth = width*0.75; 

    // Variable panel
        var variableNameHolderPadding = scaleForWindowSize(15);
        var radius = variableNameHolderPadding + "px";
        var variableNameHolderHeight = scaleForWindowSize(60); // TODO: Find this dynamically based on number of variable names (50 is the maximum), do this for font-size as well
        variableSelectionButtonWidth = scaleForWindowSize(60);
        
        var variablePanelColors = new Object();
            variablePanelColors["active"] = "lightgrey";
            variablePanelColors["disabled"] = "darkgrey";

    // Visualization panel
        var visualizationImageSize = scaleForWindowSize(200);  

// Displaying Data
    var displayDataLimit = 20;
    var rangeToFade = 3*displayDataLimit/5;
        
// Plots (general)
var axesOffset = scaleForWindowSize(25); //distance from plots to axes (for an R-like appearance)
var tickTextOffsetXAxis = 25;
var tickTextOffsetYAxis = 10;
var yAxisTickTextOffset = 6;
var fontSize = scaleForWindowSize(14);
var tickLength = scaleForWindowSize(10);
var border = scaleForWindowSize(20);

var plotHeight = canvasHeight - 2*(axesOffset + tickTextOffsetXAxis + border);
var plotWidth = 4*plotHeight/3;

// Buttons
var buttonColors = new Object();   
    buttonColors["normal"] = "white";
    buttonColors["hover"] = "lightgrey";
    buttonColors["click"] = "BlanchedAlmond";
    buttonColors["independent"] = "Peru";
    buttonColors["subject"] = "Orchid";


//Define colors for histogram bars, color scatterplot
var colors = ["rgba(255,0,0,0.8)","rgba(0,255,0,0.6)","rgba(0,0,255,0.4)", "rgba(255,255,0,0.2)","rgba(0,255,255,0.25)","rgba(255,0,255,0.25)"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "purple";
    meanColors["hover"] = "lightgreen";
    meanColors["click"] = "green";

// Histogram
var nBins = 10; 
var binCountFontSize = "16px";
var histLegendOffsetX = scaleForWindowSize(45);
var histLegendOffsetY = scaleForWindowSize(45);
var histLegendSize = scaleForWindowSize(35);
var histDistanceBetweenLegendAndText = scaleForWindowSize(15);


// Boxplots
var boxWidth = scaleForWindowSize(75);
var intervals = new Object(); //for keeping track of animations
var meanRadius = scaleForWindowSize(7) < 5 ? 5 : scaleForWindowSize(7);
var outlierRadius = 2;

var boxColors = new Object();
    boxColors["normal"] = "lightgrey";
    boxColors["notnormal"] = "crimson";

var CIFringeLength = scaleForWindowSize(5);

// Scatterplot
var datapointRadius = scaleForWindowSize(4);
var numberOfGrooves = 10;
var topOffset = scaleForWindowSize(25);
var labelOffset = scaleForWindowSize(45);

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
var normalityPlotWidth = scaleForWindowSize(125);
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = scaleForWindowSize(75); //from canvasHeight
var buttonOffset = (100);
var buttonHeight = (75);
var buttonWidth = (450);
var boxPlotTransformationDuration = 700;

var sampleSizeCutoff = 20;

//full screen button
var fullScreenButtonSize = scaleForWindowSize(75);
var fullScreenButtonOffset = scaleForWindowSize(10);

//Regression
var viewBoxXForRegressionLine = -scaleForWindowSize(300);
var viewBoxYForRegressionLine = -scaleForWindowSize(200);

var viewBoxWidthForRegressionLine = canvasWidth+scaleForWindowSize(800);
var viewBoxHeightForRegressionLine = viewBoxWidthForRegressionLine/2;








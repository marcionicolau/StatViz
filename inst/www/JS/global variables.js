//Preprocessing
var datasetInformation = new Object();
    datasetInformation["impact"] = "Dataset comparing the verbal, spatial, and other such abilities of athletes in two groups - control and concussed"
    datasetInformation["cars"] = "Dataset with details about different cars"
    datasetInformation["weightLoss"] = "Dataset comparing the weight lost by participants in 3 groups: those who skipped breakfast, those who skipped lunch, and those who skipped dinner"

var variablesInDataset = new Object();
    variablesInDataset["impact"] = ["subject","condition","verbalMemoryPre","visualMemoryPre","visualMotorSpeedPre","reactionTimePre","impulseControlPre","totalSymptomPre","verbalMemoryPost","visualMemoryPost","visualMotorSpeedPost","reactionTimePost","impulseConstrolPost","totalSymptomPost"]
    variablesInDataset["cars"] = ["Car","MPG","Cylinders","Displacement","Horsepower","Weight","Acceleration","Model","Origin"];
    variablesInDataset["weightLoss"] = ["Participant", "Condition", "WeightLost"];
 
var types = ["participant", "dependent", "independent"];
var variablesInDatasetType = new Object();
    variablesInDatasetType["impact"] = [types[0], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetType["cars"] = [types[0], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[2]];
    variablesInDatasetType["weightLoss"] = [types[0], types[2], types[1]];

var variables = new Object();     
var variableTypes = new Object(); //dependent/independent
var variableDataTypes = new Object(); //numeric/string (todo: further classification)
var IQR = new Object();   
var MIN = new Object();
var MAX = new Object();
var CI = new Object();
var splitData = new Object();
var variableNames = new Array();
var colourBoxPlotData = new Object();

var currentVariableSelection = [];    
var currentVisualizationSelection;

var fullScreen = false;
    
    
// Mouse events
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag	


var stringForNumber = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

//Significance tests
var variableDataType = new Object();
var experimentalDesign;
var significanceTestNames = new Object();
    significanceTestNames["pT"] = "Paired T-test";
    significanceTestNames["uT"] = "Unpaired T-test";
    significanceTestNames["mT"] = "Mann-Whitney U test";    
    significanceTestNames["wT"] = "Wilcoxon Signed-rank test";
    significanceTestNames["a"] = "Analysis of Variance (ANOVA)";
    significanceTestNames["kT"] = "Kruskal-Wallis test";
    significanceTestNames["rA"] = "Repeated-measures ANOVA";
    significanceTestNames["fT"] = "Friedman Test";
var currentTestType;
var testResults = new Object();
var distributions = new Object();
var variances = new Object();

//transformations
var transformationType;

var boxes = [];
var meanCircles = [];
var medianLines = [];
var topFringes = [];
var bottomFringes = [];
var topFringeConnectors = [];
var bottomFringeConnectors = [];
var CILines = [];
var CITopLines = [];
var CIBottomLines = [];
var yAxisTexts = [];

//histogram curve
var curveX = [];
var curveY = [];
var distributionType;
var densityCurveColors = new Object();
    densityCurveColors["normal"] = "green";
    densityCurveColors["notnormal"] = "red";
    
//animations B-)
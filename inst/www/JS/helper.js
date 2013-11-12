var format = d3.format(".1f");

function splitTheData()
{
    var independentVariables = [];
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableTypes[variableNames[i]] == "independent")
        {
            independentVariables.push(variableNames[i]);
        }
    }
    
    for(var i=0; i<independentVariables.length; i++)
    {   
        //for every independent variable
        for(var j=0; j<variableNames.length; j++)
        {
            //for every variable
            var uniqueData = variables[independentVariables[i]]["dataset"].unique();
            for(var k=0; k<uniqueData.length; k++)
            {
                //for every level
                for(var m=0; m<variables[variableNames[j]]["dataset"].length; m++)
                {
                    if(variables[independentVariables[i]]["dataset"][m] == uniqueData[k])
                    {
                        if(variables[variableNames[j]][uniqueData[k]] == undefined)
                        {
                            variables[variableNames[j]][uniqueData[k]] = new Array();
                            MIN[variableNames[j]][uniqueData[k]] = 999999;
                            MAX[variableNames[j]][uniqueData[k]] = -999999;
                        }
                        
                        variables[variableNames[j]][uniqueData[k]].push(variables[variableNames[j]]["dataset"][m]);                        
                        
                        if(variables[variableNames[j]]["dataset"][m] < MIN[variableNames[j]][uniqueData[k]])
                            MIN[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];
                        if(variables[variableNames[j]]["dataset"][m] > MAX[variableNames[j]][uniqueData[k]])
                            MAX[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];                        
                    }
                }
            }
            for(var k=0; k<uniqueData.length; k++)
            {
                IQR[variableNames[j]][uniqueData[k]] = findIQR(variables[variableNames[j]][uniqueData[k]]);
                CI[variableNames[j]][uniqueData[k]] = findCI(variables[variableNames[j]][uniqueData[k]]);
            }
        }
    }     
}

function splitThisLevelBy(independentVariableA, independentVariableB, dependentVariable)
{
    var splitData = new Object();
    var levelsA = variables[independentVariableA]["dataset"].unique();
    var levelsB = variables[independentVariableB]["dataset"].unique();
    
    var indepA = variables[independentVariableA]["dataset"];
    var indepB = variables[independentVariableB]["dataset"];
    var dep = variables[dependentVariable]["dataset"];
    
    for(var i=0; i<levelsA.length; i++)
    {
        splitData[levelsA[i]] = new Object();
        for(var j=0; j<levelsB.length; j++)
        {
            splitData[levelsA[i]][levelsB[j]] = new Array();
        }
    }
    
    for(var i=0; i<dep.length; i++)
    {
        var indexA = indepA[i];
        var indexB = indepB[i];
        
        splitData[indexA][indexB].push(dep[i]);
    }
    
    console.dir(splitData);
    
    return splitData;
}

//Initialise the mouse event handlers
function InitializeMouseEventHandlers()
{
    document.onmousedown = OnMouseDown;
    document.onmousemove = OnMouseMove;
    document.onmouseover = OnMouseOver;
    document.onmouseout = OnMouseOut;
}

function pickOutVisualizations()
{
    var variableList = sort(currentVariableSelection);    
    console.dir(variableList);
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 1:
                                {                                
                                    currentVisualizationSelection = "Histogram";                    
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                        default:
                                {
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                    break;
                                }
                    }
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {                                 
                                    currentVisualizationSelection = "Histogram";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualizationSelection = "Boxplot";
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                                    
                        default:
                                {                                    
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }  
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {  
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualizationSelection = "Boxplot";
                                    break;
                                }
                        default:
                                {                                    
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }
    }
}

//Resets SVG canvas, draws plot based on the visualisation selected
function makePlot(x)
{   
    resetSVGCanvas();
    drawFullScreenButton();
    
    switch(currentVisualizationSelection)
    {
        case "Histogram":
                                    {
                                        curveX = [];
                                        curveY = [];
                                        makeHistogram();
                                        break;
                                    }
        case "Boxplot":
                                    { 
                                        boxes = [];
                                        meanCircles = [];
                                        medianLines = [];
                                        topFringes = [];
                                        bottomFringes = [];
                                        topFringeConnectors = [];
                                        bottomFringeConnectors = [];
                                        CILines = [];
                                        CITopLines = [];
                                        CIBottomLines = [];
                                        yAxisTexts = [];
                                        
                                        makeBoxplot(x);
                                        break;
                                    }
        case "Scatterplot":
                                    {
                                        makeScatterplot();
                                        break;
                                    }
        case "Scatterplot-matrix":
                                    {
                                        makeScatterplotMatrix();
                                        break;
                                    }
    }
}

//Deletes the current SVG canvas and draws an empty canvas 
function resetSVGCanvas()
{
      if(document.getElementById("svgCanvas") != null)
            removeElementById("svgCanvas");
            
        var svgCanvas = d3.select("#canvas").append("svg");
        
        svgCanvas.attr("id", "svgCanvas")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("height", canvasHeight)
                                .attr("width", canvasWidth)
                                .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
}

//Removes a single element with the given ID
function removeElementById(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

//Removes all elements with the given classname
function removeElementsByClassName(className)
{
   elements = document.getElementsByClassName(className);
   while(elements.length > 0)
   {
       elements[0].parentNode.removeChild(elements[0]);
   }
}

//Adds a given element to an array by maintain unique elements
function addElementToArrayWithUniqueElements(array, element)
{   
    var variable = d3.select("#" + element + ".variableNameHolder");
    
    if(array.indexOf(element) == -1)
    {
        array.push(element);
        variable.attr("fill", panelColors.active);
    }
    
    else
    {     
        array.splice(array.indexOf(element), 1);
        variable.attr("fill", panelColors.normal);    
    }

    return array;
}

//Manages the fill colors for visualisation-holders
function toggleFillColorsForVisualizations()
{
    var variableList = sort(currentVariableSelection);
    var viz = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot-matrix"];
    validateAll();
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                break;
                        case 1:
                                invalidate([viz[2],viz[3]]);
                                break;
                        case 2:
                                break;
                        default:
                                invalidate([viz[2]]);
                    }
                    
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([ viz[1],viz[2],viz[3]]);
                                break;
                        case 1:
                                break;
                        case 2:
                                invalidate([viz[0], viz[1]]);
                                break;
                        default:
                                invalidate([viz[0], viz[1], viz[2]]);
                                break;
                    }
                    
                    break;
                }
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([viz[0], viz[1]]);
                                break;
                        case 1:
                                invalidate([viz[0]]);
                                break;
                        default:
                                invalidate([viz[0], viz[1], viz[2]]);
                                break;
                    }
                    
                    break;
                }
                
    }
    
    
    var visualizations = document.getElementsByClassName("visualizationHolderBack");
    
    for(var i=0; i<visualizations.length; i++)
    {        
        if(visualizations[i].getAttribute("id") == currentVisualizationSelection)
        {
            visualizations[i].setAttribute("fill", panelColors.active);
        }
        else
        {
            visualizations[i].setAttribute("fill", panelColors.normal);
        }
    }
}

function validateAll()
{
    var visualizations = d3.selectAll(".invalid");
    
    visualizations.attr("fill", panelColors.normal).attr("opacity", "0.1").attr("class", "visualizationHolderFront");                 
}

function invalidate(list)
{
    console.log("invalidating " + list);
    var visualizations = document.getElementsByClassName("visualizationHolderFront");
    
    for(var i=0; i<list.length; i++)
    {
        var viz = d3.select("#" + list[i] + ".visualizationHolderFront");
        viz.attr("fill", "black").attr("opacity", "0.9").attr("class", "invalid");
    }
}
//Strings/numbers processing

var toString = Object.prototype.toString;

//Checks if a given object is a string
function isString(obj)
{
  return toString.call(obj) == '[object String]';
}

//Removes alphabets in the given string
function removeAlphabetsFromString(string)
{
    return string.replace(/[A-z]/g, '');
}

//Removes numbers in the given string
function removeNumbersFromString(string)
{
    return string.replace(/[0-9]/g, '');
}

//Returns the unique elements of the given array
Array.prototype.unique = function() {
    var arr = new Array();
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

//Returns true if the given array contains a particular element
Array.prototype.contains = function(v) {
   for(var i = 0; i < this.length; i++) {
       if(this[i] === v) return true;
   }
   return false;
};

//Returns a set of valid IDs (non-numeric)
function getValidIds(labels)
{
    var validIds = true;
    
    for(var i=0; i<labels.length; i++)
    {
        if(isString(labels[i]) == false)
        {
            validIds = false;
            break;
        }            
    }    
    
    if(!validIds)
    {
        return convertIntegersToStrings(labels);        
    }
    else
    {
        return labels;
    }
}

//convert numbers to strings
function convertIntegersToStrings(numbers)
{
    var strings = new Array();
    
    for(var i=0; i<numbers.length; i++)
    {        
        var string = "";
        
        for(var j=0; j<numbers[i].toString().length; j++)
        {            
            string = string + stringForNumber[numbers[i].toString().charAt(j)];
        }
        
        strings.push(string);
    }
    
    return strings;
}

//returns the length of an object
function getObjectLength(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

//sorts the selected variables and returns the sorted object
function getSelectedVariables()
{
    var means = document.getElementsByClassName("means");
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();    
    
    //add the dependent variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(variableTypes[currentVariableSelection[i]] == "dependent")
        {
            variableList["dependent"].push(currentVariableSelection[i]);
        }
        else if(variableTypes[currentVariableSelection[i]] == "independent")
        {
            variableList["independent"].push(currentVariableSelection[i]);
        }
    }    
    
    
    //add the levels of the independent variable
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {
            if(stringForNumber.indexOf(means[i].getAttribute("id")) != -1)
            {                
                variableList["independent-levels"].push(stringForNumber.indexOf(means[i].getAttribute("id")));
            }
            else
            {
                variableList["independent-levels"].push(means[i].getAttribute("id"));
            }
        }
    }   
    
    return variableList; 
}

//Just the sorting functionality of the above function
function sort(list)
{
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();
    
    for(var i=0; i<list.length; i++)
    {
        if(variableTypes[list[i]] == "independent")
        {
            variableList["independent"].push(list[i]);
        }
        else
        {
            variableList["dependent"].push(list[i]);
        }
    }
    
    if(variableList["independent"].length > 0)
    {
        if(variableList["independent"].length == 1)
        {
            var uniqueData = variables[variableList["independent"][0]]["dataset"].unique();
        
            for(var i=0; i<uniqueData.length; i++)
            {
                variableList["independent-levels"].push(uniqueData[i]);
            }
        }
        else
        {
            for(var i=0; i<variableList["independent"].length; i++)
            {
                variableList["independent-levels"][i] = new Array();
                
                var uniqueData = variables[variableList["independent"][i]]["dataset"].unique();
        
                for(var k=0; k<uniqueData.length; k++)
                {
                    variableList["independent-levels"][i].push(uniqueData[k]);
                }
            }
        }
    }
    
    return variableList;
}

function drawFullScreenButton()
{
    var canvas = d3.select("#svgCanvas");
    
    canvas.append("image")
                .attr("x", canvas.attr("width") - (fullScreenButtonSize + fullScreenButtonOffset))
                .attr("y", 0)
                .attr("xlink:href", "images/fullscreennormal.png")
                .attr("height", fullScreenButtonSize)
                .attr("width", fullScreenButtonSize)
                .attr("style", "opacity: 1.0;")
                .attr("class", "fullscreen");
}

function drawDialogBoxToGetCausalAndPredictorVariables()
{
    var canvas = d3.select("#svgCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight)
            .attr("rx", "10px")
            .attr("ry", "10px")
            .attr("fill", "beige")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .text("Please select the causal variable")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        canvas.append("rect")
                .attr("x", centerX - dialogBoxWidth/3)
                .attr("y", centerY + i*dialogBoxHeight/6)
                .attr("width", 2*dialogBoxWidth/3)
                .attr("height", dialogBoxHeight/8)
                .attr("rx", "10px")
                .attr("ry", "10px")
                .attr("fill", "Moccasin")
                .attr("id", currentVariableSelection[i])
                .attr("class", "causalVariable");
        canvas.append("text")
                .attr("x", centerX)
                .attr("y", centerY + i*dialogBoxHeight/6 + dialogBoxHeight/16)
                .attr("text-anchor", "middle")
                .text(currentVariableSelection[i])
                .attr("id", currentVariableSelection[i])
                .attr("class", "causalVariable");
    }
}

function toModifiedViewBoxForRegressionLineXCoordinate(value)
{
    return (value - (width - canvasWidth) + viewBoxXForRegressionLine*(canvasWidth/viewBoxWidthForRegressionLine))*(viewBoxWidthForRegressionLine/canvasWidth);
}

function toModifiedViewBoxForRegressionLineYCoordinate(value)
{
    return (value + viewBoxYForRegressionLine*(canvasHeight/viewBoxHeightForRegressionLine))*(viewBoxHeightForRegressionLine/canvasHeight)
}

            

      
            
        
        
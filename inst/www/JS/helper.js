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
                console.log(
                IQR[variableNames[j]][uniqueData[k]] = findIQR(variables[variableNames[j]][uniqueData[k]]);
                findCI(variableNames[j],uniqueData[k]);
            }
        }
    }     
}

//Initialise the mouse event handlers
function InitializeMouseEventHandlers()
{
    document.onmousedown = OnMouseDown;
    document.onmousemove = OnMouseMove;
    document.onmouseover = OnMouseOver;
    document.onmouseout = OnMouseOut;
}

//Resets SVG canvas, draws plot based on the visualisation selected
function makePlot()
{   
    resetSVGCanvas();
    drawFullScreenButton();
    
    switch(currentVisualizationSelection)
    {
        case "Histogram":
                                    {
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
                                        yAxisTexts = [];
                                        
                                        makeBoxplot();
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
    var visualizations = document.getElementsByClassName("visualizationHolder");
    
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
            
            var uniqueData = variables[list[i]]["dataset"].unique();
            
            for(var j=0; j<uniqueData.length; j++)
            {
                variableList["independent-levels"].push(uniqueData[j]);
            }
        }
        else
        {
            variableList["dependent"].push(list[i]);
        }
    }
    
    return variableList;
}

function drawFullScreenButton()
{
    var canvas = d3.select("#svgCanvas");
    
    canvas.append("image")
                .attr("x", canvasWidth - fullScreenButtonSize - fullScreenButtonOffset)
                .attr("y", fullScreenButtonOffset)
                .attr("xlink:href", "images/fullscreennormal.png")
                .attr("height", fullScreenButtonSize)
                .attr("width", fullScreenButtonSize)
                .attr("style", "opacity: 1.0;")
                .attr("class", "fullscreen");
}
            

      
            
        
        
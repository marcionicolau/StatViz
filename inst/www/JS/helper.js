var format = d3.format(".1f");
var stringForNumber = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

function init()
{
    initVariableType();
    initVariableDataType();
}

function initVariableType()
{    
    console.log("setting varible types...");
    console.log(variables.length);
    console.log(getObjectLength(variables));
    for(var i=0; i<variables.length; i++)
    {        
        variableType[variables[i]] = "dependent";
        console.log(variableType[variables[i]]);
    }
}

function initVariableDataType()
{
    console.log("setting varible data types...");
    console.log(variables.length);
    console.log(getObjectLength(variables));
    for(var i=0; i<variables.length; i++)
    {        
        console.log(typeof(variables[i][0]));
    }
}
        
function makePlot()
{   
    resetSVGCanvas();
    
    switch(currentVisualizationSelection)
    {
        case "Histogram":
                                    {
                                        makeHistogram();
                                        break;
                                    }
        case "Boxplot":
                                    {         
                                        
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

//Miscellaneous

function remove(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function removeElementsByClassName(className)
{
   elements = document.getElementsByClassName(className);
   while(elements.length > 0)
   {
       elements[0].parentNode.removeChild(elements[0]);
   }
}

function resetSVGCanvas()
{
      if(document.getElementById("svgCanvas") != null)
            remove("svgCanvas");
            
        var svgCanvas = d3.select("#canvas").append("svg");
        
        svgCanvas.attr("id", "svgCanvas")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("height", canvasHeight)
                                .attr("width", canvasWidth);
}


function addToArray(array, element)
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

function findTicks(number)
{
    var factor = 0;
    if((isPrime(number)) && (number > 10))
    {
        number = number + 1;      
    }
    
    //we now have a non-prime number
    for(var i=1; i<=number/2; i++)
    {
        if((number%i == 0) && (number/i <= 10))
        {
            factor = i;
            break;
        }
    }
    
    return (number/factor)+1;
};

function toggleFillColors()
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

function isString(obj)
{
  return toString.call(obj) == '[object String]';
}

function processStrings(strings)
{
    return strings.replace(".","");
}

function getNumber(string)
{
    return string.replace(/[A-z]/g, '');
}

function getText(string)
{
    return string.replace(/[0-9]/g, '');
}

Array.prototype.unique = function() {
    var arr = new Array();
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

Array.prototype.contains = function(v) {
   for(var i = 0; i < this.length; i++) {
       if(this[i] === v) return true;
   }
   return false;
};

//Loop animation
function startLoopAnimation(meanCircle)
{
    var canvas = d3.select("#svgCanvas");
        
    //insert animation
    var loop = canvas.append("circle")
                  .attr("cx", meanCircle.attr("cx"))
                  .attr("cy", meanCircle.attr("cy"))
                  .attr("r", "0px")
                  .attr("fill", "none")
                  .attr("style", "z-index: -1;")
                  .attr("stroke", "black")
                  .attr("stroke-width", "2px")				
                  .attr("class", "loops");

    loop.transition().duration(1500).attr("r", "25px").attr("opacity", "0.5").attr("stroke","lightgrey");
    loop.transition().delay(2500).attr("opacity", "0");

    intervals[meanCircle.attr("id")] = setInterval(function()
    {						
       var loop = canvas.append("circle")
                     .attr("cx", meanCircle.attr("cx"))
                     .attr("cy", meanCircle.attr("cy"))
                     .attr("r", "0px")
                     .attr("fill", "none")
                     .attr("style", "z-index: -1;")
                     .attr("stroke", "black")
                     .attr("stroke-width", "2px")				
                     .attr("class", "loops");

       loop.transition().duration(1500).attr("r", "25px").attr("opacity", "0.5").attr("stroke","lightgrey");
       loop.transition().delay(2500).attr("opacity", "0");
    },700);
}

//Bin hover
function highlightBinWithId(ID)
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    var binTextLines = document.getElementsByClassName("binTexts");
    
    for(var i=0; i<bins.length; i++)
    {    
        if(getNumber(bins[i].getAttribute("id")) != getNumber(ID))
        {
            bins[i].setAttribute("opacity", "0.25");
        }
        else
        {
            bins[i].setAttribute("opacity", "1.0");
            
            binText = d3.select("#" + bins[i].getAttribute("id") + ".binTexts");
            binTextLine = d3.select("#" + bins[i].getAttribute("id") + ".binTextLines");
            
            if(binText.length > 0)
            {                
                binText.attr("display", "inline");
                if(binTextLine.length > 0)
                {
                    binTextLine.attr("display", "inline");
                }
            }
        }
    }
}

function unhighlightBins()
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    var binTextLines = document.getElementsByClassName("binTextLines");
    
    for(var i=0; i<bins.length; i++)
    {   
        bins[i].setAttribute("opacity", "1.0");

        binTexts = d3.selectAll(".binTexts");
        binTextLines = d3.selectAll(".binTextLines");
            
        if(binTexts.length > 0)
        {
            binTexts.attr("display", "none");
            if(binTextLines.length > 0)
            {
                binTextLines.attr("display", "none");
            }
        }
    }
}

//convert numbers to strings (1:one, 2:two, etc)
function encodeToStrings(numbers)
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
        if(variableType[currentVariableSelection[i]] != false)
        {
            variableList["dependent"].push(currentVariableSelection[i]);
        }
        else
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
        return encodeToStrings(labels);        
    }
    else
    {
        return labels;
    }
}

function setDistribution(dependentVariable, level, normal)
{    
    if(distributions[dependentVariable] == undefined)
        distributions[dependentVariable] = new Object();
    
    distributions[dependentVariable][level] = normal;
    
    if(getObjectLength(distributions[dependentVariable]) == (document.getElementsByClassName("completeLines").length + 1))
    {       
        var variableList = getSelectedVariables();
        var normal = true;
        
        for(var i=0; i<variableList["independent-levels"].length; i++)
        {   
            if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
            {
                d3.select("#" + assumptions[1] + ".crosses").attr("display", "inline");                  
                normal = false;

                //draw boxplots in red 
            }
        }
        
        if(normal)
        {            
            d3.select("#" + assumptions[1] + ".ticks").attr("display", "inline");                              
            performTTest(variables[variableList["dependent"][0]][levels[0]], variables[variableList["dependent"][0]][levels[1]]);                       
        }
    }    
}

function getObjectLength(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function sort(list)
{
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();
    
    for(var i=0; i<list.length; i++)
    {
        if(variableType[list[i]] == false)
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

      
            
        
        
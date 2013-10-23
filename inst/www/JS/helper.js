var format = d3.format(".1f");	

function initVariableTypes()
{
    for(var i=0; i<variables.length; i++)
    {
        variableType[variables[i]] = true;
    }
}

function remove(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
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
                                        for(var i=0; i<currentVariableSelection.length; i++)
                                        {
                                            if(!variableType[currentVariableSelection[i]])
                                            {
                                                var uniqueData = variables[currentVariableSelection[i]].unique();
                                                
                                                console.log("unique data: " + uniqueData);
                                                
                                                for(var j=0; j<uniqueData.length; j++)
                                                {
                                                    splitDataByColumnName(dataset, currentVariableSelection[i], uniqueData[j]);
                                                }
                                            }
                                        }                                        
                                        
                                        
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

function processStrings(strings)
{
    return strings.replace(".","");
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

function removeElementsByClass(className)
{
   elements = document.getElementsByClassName(className);
   while(elements.length > 0)
   {
       elements[0].parentNode.removeChild(elements[0]);
   }
}

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

function highlightBinWithId(ID)
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    
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
            
            if(binText.length > 0)
            {                
                binText.attr("display", "inline");
            }
        }
    }
}

function unhighlightBins()
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    
    for(var i=0; i<bins.length; i++)
    {   
        bins[i].setAttribute("opacity", "1.0");

        binTexts = d3.selectAll(".binTexts");
            
        if(binTexts.length > 0)
        {
            binTexts.attr("display", "none");
        }
    }
}

function getNumber(string)
{
    return string.replace(/[A-z]/g, '');
}

function getText(string)
{
    return string.replace(/[0-9]/g, '');
}

      
            
        
        
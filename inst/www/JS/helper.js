function remove(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function getNumber(value)
{
    var n = parseInt(value);

    return n == null || isNaN(n) ? 0 : n;
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
        console.log(visualizations.length);
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
        case "Box-plot":
                                    {            
                                        makeBoxplot();
                                        break;
                                    }
        case "Scatter-plot":
                                    {
                                        makeScatterplot();
                                        break;
                                    }
    }
}

function resetSVGCanvas()
{
      if(document.getElementById("svgCanvas") != null)
            remove("svgCanvas");
            
        var svgCanvas = canvas.append("svg");
        
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
            
        
        
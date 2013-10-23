var mins = new Object();
var maxs = new Object();
   
   
function makeScatterplot()
{   
    var data = [];
    var mins = [];
    var maxs = [];
    
    var colorsForPlot = new Object();
    
    var altScatterPlot = false;
   
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {   
        if(variableType[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
        {
            // Levels are needed when we have a independent variable and one or more dependent variables
            levels = variables[currentVariableSelection[i]]["dataset"].unique();            
            altScatterPlot = true;
        }
    }
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        if(altScatterPlot)
        {
            if(variableType[currentVariableSelection[i]] != false)
            {
                //for the dependent variable(s)
                
                for(var j=0; j<levels.length; j++)
                {
                    // for each level of the independent variable, find the dependent variables                    
                    
                    data[j] = variables[currentVariableSelection[i]][levels[j]];
                    mins[j] = MIN[currentVariableSelection[i]][levels[j]];      
                    maxs[j] = MAX[currentVariableSelection[i] ][levels[j]]; 
                    
                    console.log("data= [" + data[j] +"]\nmin=" + mins[j] + "\nmax=" + maxs[j]);                         
                }
            }  
        }
        else 
        {               
            data[i] = variables[currentVariableSelection[i]]["dataset"];      
            mins[i] = MIN[currentVariableSelection[i]]["dataset"];      
            maxs[i] = MAX[currentVariableSelection[i]]["dataset"];            
        }             
    }
    
    if(currentVariableSelection.length == 3)
    {
        var uniqueData = data[2].unique();
        
        for(var i=0; i<uniqueData.length; i++)
        {
            colorsForPlot[uniqueData[i]] = colors[i];
        }
    }

     
    var canvas = d3.select("#svgCanvas");
    
    
    
    

    // changeable
    var nGrooves = 10;
    
    // Draw axes
        
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 + size/2 + axesOffset)
                                    .attr("x2", canvasWidth/2 + size/2)
                                    .attr("y2", canvasHeight/2 + size/2 + axesOffset) 
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2 - axesOffset)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");
                                    
    
    //grooves
    
    //todo: x-axis grooves
    
    //y-axis grooves
    var step = size/(nGrooves-1);
    var xSlice = (maxs[0] - mins[0])/(nGrooves-1);    
    var ySlice = (maxs[1] - mins[1])/(nGrooves-1);    
    
    //grooves
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + i*step)
                    .attr("y1", canvasHeight/2 + size/2 + axesOffset)
                    .attr("x2", canvasWidth/2 - size/2 + i*step)
                    .attr("y2", canvasHeight/2 + size/2 + 10 + axesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 + i*step - 15)
                    .attr("y", canvasHeight/2 + size/2 + 30 + axesOffset)                    
                    .text(format(mins[0] + i*xSlice))
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 - 10 - axesOffset)
                    .attr("y1", canvasHeight/2 + size/2 - i*step)
                    .attr("x2", canvasWidth/2 - size/2  - axesOffset)
                    .attr("y2", canvasHeight/2 + size/2 - i*step)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 55 - axesOffset)
                    .attr("y", canvasHeight/2 + size/2 - i*step)                    
                    .text(format(mins[1] + i*ySlice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<data[0].length; i++)
    {
        var color = currentVariableSelection.length > 2 ? colorsForPlot[data[2][i]] : "black";
        
        canvas.append("circle")
                    .attr("cx", canvasWidth/2 - size/2 + getValue(data[0][i], 0)*size)
                    .attr("cy", canvasHeight/2 + size/2 - getValue(data[1][i], 1)*size)
                    .attr("r", datapointRadius)
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function getValue(number, type)
{
    console.log("number:" + number);
    console.log("mins:" + mins[type]);
    console.log("maxs:" + maxs[type]);
    return (number - mins[type])/(maxs[type] - mins[type]);
}
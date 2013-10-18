var mins = new Object();
var maxs = new Object();
   
   
function makeScatterplotMatrix()
{
    var data = new Array();
    
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {   
       data[i] = variables[currentVariableSelection[i]];
       mins[i] = MIN[currentVariableSelection[i]];      
       maxs[i] = MAX[currentVariableSelection[i]];      
       
    }
    
    cellSize = size/(currentVariableSelection.length*currentVariableSelection.length);
    
    var factor;
    var n = currentVariableSelection.length;
    
    if(n % 2 == 0)
    {
        //even
        factor = -(n-1)/(2*n);
    }
    else
    {
        //odd
        factor = -Math.floor(n/2)/n;
    }
    
    for(i=0; i<currentVariableSelection.length; i++)
    {
        for(j=0; j<currentVariableSelection.length; j++)
        {
            if(j != i)
            {
                makeScatterplotInCell([currentVariableSelection[i], currentVariableSelection[j]], "translate(" + (factor*size + j*(size/n)) + " " + (factor*size + i*(size/n)) + ")");
            }
        }
    }
}

function makeScatterplotInCell(variablesToPlot, transform)
{
    var data = new Object();
    var colorsForPlot = new Object();
    
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<variablesToPlot.length; i++)
    {    
            
        if(i == 0)
        {
            data["X"] = variables[variablesToPlot[i]];      
            mins["X"] = MIN[variablesToPlot[i]];      
            maxs["X"] = MAX[variablesToPlot[i]];      
        }
        if(i == 1)
        {
            data["Y"] = variables[variablesToPlot[i]];      
            mins["Y"] = MIN[variablesToPlot[i]];      
            maxs["Y"] = MAX[variablesToPlot[i]];      
        }
        // if(i == 2)
//         {
//             data["color"] = variables[currentVariableSelection[i]];
//             mins["color"] = MIN[currentVariableSelection[i]];      
//             maxs["color"] = MAX[currentVariableSelection[i]];      
//             
//             var uniqueData = data["color"].unique();
//             
//             for(var i=0; i<uniqueData.length; i++)
//             {
//                 colorsForPlot[uniqueData[i]] = colors[i];
//             }
//         }
    }
     
    var canvas = d3.select("#svgCanvas");
    
    // changeable
    var nGrooves = 3;
    
    // Draw axes
    canvas.append("circle")
                .attr("cx", canvasWidth/2)
                .attr("cy", canvasHeight/2)
                .attr("r", "50px")
                .attr("fill", "magenta");
    
    // var xAxis = canvas.append("line")
//                                     .attr("x1", canvasWidth/2 - size/2)
//                                     .attr("y1", canvasHeight/2 + size/2 + axesOffset)
//                                     .attr("x2", canvasWidth/2 + size/2)
//                                     .attr("y2", canvasHeight/2 + size/2 + axesOffset) 
//                                     .attr("stroke", "black")
//                                     .attr("transform", transform)
//                                     .attr("id", "xAxis")
//                                     .attr("class", "axes");
//     
//     var yAxis = canvas.append("line")
//                                     .attr("x1", canvasWidth/2 - size/2 - axesOffset)
//                                     .attr("y1", canvasHeight/2 - size/2)
//                                     .attr("x2", canvasWidth/2 - size/2 - axesOffset)
//                                     .attr("y2", canvasHeight/2 + size/2)
//                                     .attr("stroke", "black")
//                                     .attr("transform", transform)
//                                     .attr("id", "yAxis")
//                                     .attr("class", "axes");
//                                     
//     
//     //grooves
//     
//     //todo: x-axis grooves
//     
//     //y-axis grooves
//     var step = size/(nGrooves-1);
//     var xSlice = (maxs["X"] - mins["X"])/(nGrooves-1);    
//     var ySlice = (maxs["Y"] - mins["Y"])/(nGrooves-1);    
//     
//     //grooves
//     for(i=0; i<nGrooves; i++)
//     {
//         canvas.append("line")
//                     .attr("x1", canvasWidth/2 - size/2 + i*step)
//                     .attr("y1", canvasHeight/2 + size/2 + axesOffset)
//                     .attr("x2", canvasWidth/2 - size/2 + i*step)
//                     .attr("y2", canvasHeight/2 + size/2 + 10 + axesOffset)
//                     .attr("transform", transform)
//                     .attr("id", "groove" + i)
//                     .attr("class", "xAxisGrooves");
//         
//         canvas.append("text")
//                     .attr("x", canvasWidth/2 - size/2 + i*step - 15)
//                     .attr("y", canvasHeight/2 + size/2 + 30 + axesOffset)                    
//                     .text(format(mins["X"] + i*xSlice))
//                     .attr("transform", transform)
//                     .attr("id", "groove" + i)
//                     .attr("class", "xAxisGrooveText");
//     }
//     
//     for(i=0; i<nGrooves; i++)
//     {
//         canvas.append("line")
//                     .attr("x1", canvasWidth/2 - size/2 - 10 - axesOffset)
//                     .attr("y1", canvasHeight/2 + size/2 - i*step)
//                     .attr("x2", canvasWidth/2 - size/2  - axesOffset)
//                     .attr("y2", canvasHeight/2 + size/2 - i*step)
//                     .attr("transform", transform)
//                     .attr("id", "groove" + i)
//                     .attr("class", "yAxisGrooves");
//         
//         canvas.append("text")
//                     .attr("x", canvasWidth/2 - size/2 - 55 - axesOffset)
//                     .attr("y", canvasHeight/2 + size/2 - i*step)                    
//                     .text(format(mins["Y"] + i*ySlice))
//                     .attr("transform", transform)
//                     .attr("id", "groove" + i)
//                     .attr("class", "yAxisGrooveText");
//     }
//     
//     for(var i=0; i<data["X"].length; i++)
//     {
//         canvas.append("circle")
//                     .attr("cx", canvasWidth/2 - size/2 + getValue(data["X"][i], "X")*size)
//                     .attr("cy", canvasHeight/2 - size/2 + getValue(data["Y"][i], "Y")*size)
//                     .attr("transform", transform)
//                     .attr("r", "2px")
//                     .attr("fill", "black");     
//     }
}

function getValue(number, type)
{
    return (number - mins[type])/(maxs[type] - mins[type]);
}
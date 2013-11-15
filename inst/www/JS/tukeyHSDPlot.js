function drawTukeyHSDPlot()
{
    //graphics
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
     
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#svgCanvas");
    
    //data - we have already sorted them into "tukeyResults" object 
    var variableList = sort(currentVariableSelection);    
    var levels = variables[variableList["independent"][0]]["dataset"].unique();    
    
    var min = tukeyResultsMin;
    var max = tukeyResultsMax;
    
    //Axes
    var xAxis = canvas.append("line")
                        .attr("x1", LEFT)
                        .attr("y1", BOTTOM + axesOffset)
                        .attr("x2", RIGHT)
                        .attr("y2", BOTTOM + axesOffset) 
                        .attr("stroke", "black")
                        .attr("id", "xAxis")
                        .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                        .attr("x1", LEFT - 2*axesOffset)
                        .attr("y1", TOP)
                        .attr("x2", LEFT - 2*axesOffset)
                        .attr("y2", BOTTOM)
                        .attr("stroke", "black")
                        .attr("id", "yAxis")
                        .attr("class", "axes");
    
    //Y-axis label
    canvas.append("text")
                .attr("x", LEFT - axesOffset - labelOffset)
                .attr("y", (TOP + BOTTOM)/2 + 6)
                .attr("text-anchor", "end")
                .attr("font-size", "24px")
                .text("Mean Difference in " + variableList["dependent"][0])
                .attr("transform", "rotate(-90 " + (LEFT - axesOffset - labelOffset) + " " + ((TOP + BOTTOM)/2 + 6) + ")")
                .attr("fill", "orange");
                
    //X-axis grooves
    var numberOfGroovesInXAxis = findNumberOfCombinations(levels.length,2);    
    var xStep = plotWidth/(numberOfGroovesInXAxis - 1);   

    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT + i*xStep)
                    .attr("y1", BOTTOM  + axesOffset)
                    .attr("x2", LEFT + i*xStep)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("class", "xAxisGrooves");

        canvas.append("text")
                    .attr("x", LEFT + i*xStep)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                    .text(levels[i] + "-" + levels[(i+1)%levels.length])
                    .attr("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr("class", "xAxisGrooveText");
    }
    
    //Y-axis grooves
    var numberOfGroovesInYAxis = 10;
    var yStep = plotHeight/(numberOfGroovesInYAxis - 1);   
    var ySlice = (max - min)/(numberOfGroovesInYAxis - 1);   

    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        var axisText = format(min + i*ySlice);
        var textPosition = BOTTOM - i*yStep;                  
        
        canvas.append("line")
                    .attr("x1", LEFT - 10 - axesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", LEFT  - axesOffset)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", textPosition + yAxisTickTextOffset)                     
                    .text(axisText)
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }   
//     
//     for(var i=0; i<interactions.length; i++)
//     {
//         var x,y;
//         
//         x = LEFT + levelsOfIndependentVariableXAxis.indexOf(levelsOfIndependentVariableXAxis[i%levelsOfIndependentVariableXAxis.length])*xStep;
//         y = BOTTOM - getValue1(interactions[i], min, max)*plotHeight;        
//         
//         var color = colors[Math.floor(i/(interactions.length/levelsOfIndependentVariableColor.length))];
//         
//         canvas.append("circle")
//                     .attr("cx", x)
//                     .attr("cy", y)
//                     .attr("r", "5px")
//                     .attr("fill", color)
//                     .attr("id", "c" + Math.floor(i/(interactions.length/levelsOfIndependentVariableColor.length)) + (i%levelsOfIndependentVariableXAxis.length))
//                     .attr("class", "effs");     
//     }
//     
//     for(var i=0; i<levelsOfIndependentVariableColor.length; i++)
//     {
//         var circles = [];
//         
//         for(var j=0; j<levelsOfIndependentVariableXAxis.length; j++)
//         {
//             circles.push(d3.select("#c" + i + j + ".effs"));
//             
//             if(j != 0)
//             {
//                 canvas.append("line")
//                         .attr("x1", circles[j].attr("cx"))
//                         .attr("y1", circles[j].attr("cy"))
//                         .attr("x2", circles[j-1].attr("cx"))
//                         .attr("y2", circles[j-1].attr("cy"))
//                         .attr("stroke", colors[i]);
//             }
//         }        
//     }
}
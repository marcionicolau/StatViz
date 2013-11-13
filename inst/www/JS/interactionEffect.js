function drawInteractionEffectPlot()
{
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
     
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
    var dependentVariable = variableList["dependent"][0];
    
    var independentVariableXAxis = variableList["independent"][0];
    var independentVariableColor = variableList["independent"][1];
    
    var dependentVariableData = variables[dependentVariable]["dataset"];
    
    var independentVariableXAxisData = variables[independentVariableXAxis]["dataset"];
    var independentVariableColorData = variables[independentVariableColor]["dataset"];
    
    var levelsOfIndependentVariableXAxis = independentVariableXAxisData.unique();
    var levelsOfIndependentVariableColor = independentVariableColorData.unique();
    
    
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
                        .attr("x1", LEFT - axesOffset)
                        .attr("y1", TOP)
                        .attr("x2", LEFT - axesOffset)
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
                .text(dependentVariable)
                .attr("fill", "orange");
                
    //X-axis labels 
    var numberOfGroovesInXAxis = levelsOfIndependentVariableXAxis.length;
    
    var xStep = plotWidth/numberOfGroovesInXAxis;   

    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT + i*xStep + xStep/2)
                    .attr("y1", BOTTOM  + axesOffset)
                    .attr("x2", LEFT + i*xStep + xStep/2)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("id", ids[i])
                    .attr("class", "xAxisGrooves");

        canvas.append("text")
                    .attr("x", LEFT + i*xStep + xStep/2)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                    .text(levelsOfIndependentVariableXAxis[i])
                    .attr("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr("id", ids[i])
                    .attr("class", "xAxisGrooveText");
    }
   
}
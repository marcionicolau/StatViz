var max;
var min;

var data;
var iqr;

var topFringe;
var bottomFringe;

function makeBoxplot()
{
    //boundaries    
    var left = canvasWidth/2 - plotWidth/2;
    var right = canvasWidth/2 + plotWidth/2;
    
    var top = canvasHeight/2 - plotHeight/2;
    var bottom = canvasHeight/2 + plotHeight/2;
    
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    
    var variableList = sort(currentVariableSelection);
    
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        //color plot
                        break;                        
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    var labels;
    var levels = variableList["independent-levels"];
    
    if(altBoxPlot == true)    
    {
        labels = levels;
    }    
    else    
    {        
        labels = currentVariableSelection;
    }
    
    var ids = getValidIds(labels);
    
    var canvas = d3.select("#svgCanvas");

    // changeable
    var nGroovesY = 10;
    
    // Draw axes
        
    var xAxis = canvas.append("line")
                                    .attr("x1", left)
                                    .attr("y1", bottom + axesOffset)
                                    .attr("x2", right)
                                    .attr("y2", bottom + axesOffset) 
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", left - axesOffset)
                                    .attr("y1", top)
                                    .attr("x2", left - axesOffset)
                                    .attr("y2", bottom)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");
                                    
    
    //grooves
    
    //x-axis grooves    
    var nGroovesX;
    var labels;
    
    if(altBoxPlot == true)    
    {
        nGroovesX = levels.length;
        labels = levels;
    }    
    else    
    {
        nGroovesX = currentVariableSelection.length;            
        labels = currentVariableSelection;
    }
    
    var xStep = plotWidth/nGroovesX;       

    for(i=0; i<nGroovesX; i++)
    {
        canvas.append("line")
                    .attr("x1", left + i*xStep + xStep/2)
                    .attr("y1", bottom  + axesOffset)
                    .attr("x2", left + i*xStep + xStep/2)
                    .attr("y2", bottom + 10 + axesOffset)
                    .attr("id", ids[i])
                    .attr("class", "xAxisGrooves");
    
        canvas.append("text")
                    .attr("x", left + i*xStep + xStep/2)
                    .attr("y", bottom + tickTextOffsetXAxis + axesOffset)                    
                    .text(labels[i])
                    .attr("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr("id", ids[i])
                    .attr("class", "xAxisGrooveText");
    }
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    
    
    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", left - 10 - axesOffset)
                    .attr("y1", bottom - i*yStep)
                    .attr("x2", left - axesOffset)
                    .attr("y2", bottom - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", left - tickTextOffsetYAxis - axesOffset)
                    .attr("y", bottom - i*yStep + yAxisTickTextOffset)                    
                    .text(format(min + i*slice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
        var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
        canvas.append("rect")
                    .attr("x", left + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y", bottom - getFraction(rectTop)*plotHeight)
                    .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                    .attr("width", boxWidth)
                    .attr("fill", boxColors["normal"])
                    .attr("stroke", "black")
                    .attr("id", ids[i])
                    .attr("class", "IQRs");
                
        // median
        canvas.append("line")
                    .attr("x1", left + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y1", bottom - getFraction(medians[i])*plotHeight)
                    .attr("x2", left + i*widthSlice + boxWidth/2 + xStep/2)
                    .attr("y2", bottom - getFraction(medians[i])*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "medians");
    
        //end fringes
        bottomFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
        topFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", bottom - getFraction(topFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", bottom - getFraction(topFringe)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "topFringes");
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", bottom - getFraction(topFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", bottom- getFraction(medians[i] + iqrs[i]/2)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "topFringeConnectors");    
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", bottom - getFraction(bottomFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", bottom - getFraction(bottomFringe)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "bottomFringes");
                
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", bottom - getFraction(bottomFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", bottom - getFraction(rectBottom)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "bottomFringeConnectors");
    
        canvas.append("circle")
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", bottom - getFraction(means[i])*plotHeight)
                    .attr("r", meanRadius)
                    .attr("fill", meanColors["normal"])
                    .attr("style", "z-index: 5;")
                    .attr("id", ids[i])
                    .attr("class", "means");
    
        var outliers = getOutliers(data[i], topFringe, bottomFringe);
            
        for(var j=0; j<outliers.length; j++)
        {
            canvas.append("circle")
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", bottom - getFraction(outliers[j])*plotHeight)
                    .attr("r", outlierRadius)
                    .attr("id", ids[i])
                    .attr("class", "outliers");
        }
    }        
}

function drawBoxPlotInRed(dependentVariable, level)
{
    var box = d3.select("#" + level + ".IQRs");    
    box.attr("fill", boxColors["notnormal"]);
    
    var text = d3.select("#" + level + ".xAxisGrooveText");
    text.attr("fill", boxColors["notnormal"]);
}

function getFraction(number)
{
    return (number - min)/(max - min);
}

function getValue(fraction)
{
    return (fraction*(max - min)) + min;
}

function getOutliers(data, topFringe, bottomFringe)
{
    var outliers = [];
    
    for(var i=0; i<data.length; i++)
    {
        if((data[i] > (topFringe) )|| (data[i] < (bottomFringe) ))
        {
            outliers.push(data[i]);
        }
    }   
    return outliers;
}
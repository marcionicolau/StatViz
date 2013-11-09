var max;
var min;

var data;
var iqr;

var TOPFringe;
var BOTTOMFringe;

function makeBoxplot()
{
    //boundaries    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var cis = [];
    
        var levels = new Array();
    
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
                            cis[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            cis[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   
                                if(splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]].length > 0)
                                {
                                    levels.push("[" + variableList["independent-levels"][0][i] + "][" + variableList["independent-levels"][1][j] + "]");
                                
                                    data[i*variableList["independent-levels"][0].length + j] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                    mins[i*variableList["independent-levels"][0].length + j] = Array.min(data[i*variableList["independent-levels"][0].length + j]);
                                    maxs[i*variableList["independent-levels"][0].length + j] = Array.max(data[i*variableList["independent-levels"][0].length + j]);
                                    means[i*variableList["independent-levels"][0].length + j] = mean(data[i*variableList["independent-levels"][0].length + j]);
                                    medians[i*variableList["independent-levels"][0].length + j] = median(data[i*variableList["independent-levels"][0].length + j]);
                                    iqrs[i*variableList["independent-levels"][0].length + j] = findIQR(data[i*variableList["independent-levels"][0].length + j]);
                                    cis[i*variableList["independent-levels"][0].length + j] = findCI(data[i*variableList["independent-levels"][0].length + j]);
                                }
                            }
                        }
                        
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
        cis[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    console.dir(data);
    console.dir(mins);
    console.dir(maxs);
    console.dir(means);
    console.dir(medians);
    console.dir(iqrs);
    console.dir(cis);
    
    var labels;
    
    if(variableList["independent"].length == 1)
    {
        levels = variableList["independent-levels"];
    }  
    
    
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
                    .attr("x1", LEFT + i*xStep + xStep/2)
                    .attr("y1", BOTTOM  + axesOffset)
                    .attr("x2", LEFT + i*xStep + xStep/2)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("id", ids[i])
                    .attr("class", "xAxisGrooves");
    
        canvas.append("text")
                    .attr("x", LEFT + i*xStep + xStep/2)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
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
                    .attr("x1", LEFT - 10 - axesOffset)
                    .attr("y1", BOTTOM - i*yStep)
                    .attr("x2", LEFT - axesOffset)
                    .attr("y2", BOTTOM - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        yAxisTexts.push(canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
                    .text(format(min + i*slice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText"));
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
        var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
        boxes.push(canvas.append("rect")
                    .attr("x", LEFT + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                    .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                    .attr("width", boxWidth)
                    .attr("fill", boxColors["normal"])
                    .attr("stroke", "black")
                    .attr("id", ids[i])
                    .attr("class", "IQRs"));
                
        // median
        medianLines.push(canvas.append("line")
                    .attr("x1", LEFT + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                    .attr("x2", LEFT + i*widthSlice + boxWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "medians"));
    
        //end fringes
        BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
        TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
        topFringes.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight)
                    .attr("id", ids[i])
                    .attr("stroke-width", "2")
                    .attr("class", "TOPFringes"));
    
        topFringeConnectors.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "TOPFringeConnectors"));    
    
        bottomFringes.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                    .attr("id", ids[i])
                    .attr("stroke-width", "2")
                    .attr("class", "BOTTOMFringes"));
                
        bottomFringeConnectors.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight)
                    .attr("id", ids[i])
                    .attr("class", "BOTTOMFringeConnectors"));
    
        
        
        CILines.push(canvas.append("line")
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                .attr("y1", BOTTOM - getFraction(cis[i][0])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                .attr("y2", BOTTOM - getFraction(cis[i][1])*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("id", ids[i])
                .attr("class", "CIs"));
        
        CIBottomLines.push(canvas.append("line")
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                .attr("y1", BOTTOM - getFraction(cis[i][0])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                .attr("y2", BOTTOM - getFraction(cis[i][0])*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("id", ids[i])
                .attr("class", "CIBottomFringes"));
        
        CITopLines.push(canvas.append("line")
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                .attr("y1", BOTTOM - getFraction(cis[i][1])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                .attr("y2", BOTTOM - getFraction(cis[i][1])*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("id", ids[i])
                .attr("class", "CITopFringes"));
        
        var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
        for(var j=0; j<outliers.length; j++)
        {
            canvas.append("circle")
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                    .attr("r", outlierRadius)
                    .attr("id", ids[i])
                    .attr("class", "outliers");
        }
        
        
        meanCircles.push(canvas.append("circle")
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", BOTTOM - getFraction(means[i])*plotHeight)
                    .attr("r", meanRadius)
                    .attr("fill", meanColors["normal"])
                    .attr("style", "z-index: 5;")
                    .attr("id", ids[i])
                    .attr("class", "means"));
    }        
}

function redrawBoxPlot()
{
    //boundaries    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var cis = [];
    
    var variableList = getSelectedVariables(currentVariableSelection);
    
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
                            cis[i] = CI[variableList["dependent"][i]]["dataset"]; 
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
                            cis[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
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
        cis[0] = CI[currentVariableSelection[0]]["dataset"];
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
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    
    
    for(i=0; i<nGroovesY; i++)
    {
        yAxisTexts[i].transition().duration(boxPlotTransformationDuration)        
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
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
        
        boxes[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x", LEFT + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                    .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                    .attr("width", boxWidth)
                    .attr("fill", boxColors["normal"]);
                
        // median
        medianLines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", LEFT + i*widthSlice - boxWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                    .attr("x2", LEFT + i*widthSlice + boxWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight);
    
        //end fringes
        BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
        TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
        topFringes[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight);
    
        topFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight);    
    
        bottomFringes[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 - boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight);
                
        bottomFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight);
        
        CILines[i].transition().duration(boxPlotTransformationDuration)
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                .attr("y1", BOTTOM - getFraction(cis[i][0])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                .attr("y2", BOTTOM - getFraction(cis[i][1])*plotHeight);
        
        CIBottomLines[i].transition().duration(boxPlotTransformationDuration)
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                .attr("y1", BOTTOM - getFraction(cis[i][0])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                .attr("y2", BOTTOM - getFraction(cis[i][0])*plotHeight);
        
        CITopLines[i].transition().duration(boxPlotTransformationDuration)
                .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                .attr("y1", BOTTOM - getFraction(cis[i][1])*plotHeight)
                .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                .attr("y2", BOTTOM - getFraction(cis[i][1])*plotHeight);
        
        removeElementsByClassName("outliers");
    
        var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
        for(var j=0; j<outliers.length; j++)
        {
            canvas.append("circle")
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                    .attr("r", outlierRadius)
                    .attr("id", ids[i])
                    .attr("class", "outliers");
        }
    
        meanCircles[i].transition().duration(boxPlotTransformationDuration)
                    .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("cy", BOTTOM - getFraction(means[i])*plotHeight);
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

function getOutliers(data, TOPFringe, BOTTOMFringe)
{
    var outliers = [];
    
    for(var i=0; i<data.length; i++)
    {
        if((data[i] > (TOPFringe) )|| (data[i] < (BOTTOMFringe) ))
        {
            outliers.push(data[i]);
        }
    }   
    return outliers;
}

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
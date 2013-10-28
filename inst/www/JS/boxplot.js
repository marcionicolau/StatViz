var max;
var min;

var data;
var iqr;

var topFringe;
var bottomFringe;

function makeBoxplot()
{
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {   
        if(variableType[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
        {
            // Levels are needed when we have a independent variable and one or more dependent variables
            levels = variables[currentVariableSelection[i]]["dataset"].unique();            
            altBoxPlot = true;
        }
    }
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        if(altBoxPlot)
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
                    medians[j] = median(data[j]);
                    iqrs[j] = IQR[currentVariableSelection[i]][levels[i]];  
                    means[j] = mean(data[j]);  
                }
            }  
        }
        else 
        {               
            data[i] = variables[currentVariableSelection[i]]["dataset"];      
            mins[i] = MIN[currentVariableSelection[i]]["dataset"];      
            maxs[i] = MAX[currentVariableSelection[i]]["dataset"];
            medians[i] = median(data[i]);
            iqrs[i] = IQR[currentVariableSelection[i]]["dataset"];
            means[i] = mean(data[i]);  
        }             
    }
    
    console.log(data);
    
    var nPlots = levels.length;
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    var canvas = d3.select("#svgCanvas");

    // changeable
    var nGroovesY = 10;
    
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
    var yStep = size/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    
    
    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 - 10 - axesOffset)
                    .attr("y1", canvasHeight/2 + size/2 - i*yStep)
                    .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                    .attr("y2", canvasHeight/2 + size/2 - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 55 - axesOffset)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep)                    
                    .text(format(min + i*slice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    var widthSlice = size/(nPlots+1);
    
    for(var i=0; i<nPlots; i++)
    {
        var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
        var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
        canvas.append("rect")
                    .attr("x", canvasWidth/2 - size/2 + (i+1)*widthSlice - boxWidth/2)
                    .attr("y", canvasHeight/2 + size/2 - getFraction(rectTop)*size)
                    .attr("height", getFraction(rectTop)*size - getFraction(rectBottom)*size)
                    .attr("width", boxWidth)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "IQRs");
                
        // median
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + (i+1)*widthSlice - boxWidth/2)
                    .attr("y1", canvasHeight/2 + size/2 - getFraction(medians[i])*size)
                    .attr("x2", canvasWidth/2 - size/2 + (i+1)*widthSlice + boxWidth/2)
                    .attr("y2", canvasHeight/2 + size/2 - getFraction(medians[i])*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "medians");
    
        //end fringes
        bottomFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
        topFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getFraction(topFringe)*size)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getFraction(topFringe)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "topFringes");
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getFraction(topFringe)*size)
                    .attr("x2", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2- getFraction(medians[i] + iqrs[i]/2)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "topFringeConnectors");    
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getFraction(bottomFringe)*size)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getFraction(bottomFringe)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "bottomFringes");
                
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getFraction(bottomFringe)*size)
                    .attr("x2", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getFraction(rectBottom)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "bottomFringeConnectors");
    
        canvas.append("circle")
                    .attr("cx", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("cy", canvasHeight/2 + size/2 - getFraction(means[i])*size)
                    .attr("r", meanRadius)
                    .attr("fill", meanColors["normal"])
                    .attr("style", "z-index: 5;")
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "means");
    
        var outliers = getOutliers(data[i], topFringe, bottomFringe);
            
        for(var j=0; j<outliers.length; j++)
        {
            canvas.append("circle")
                    .attr("cx", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("cy", canvasHeight/2 + size/2 - getFraction(outliers[j])*size)
                    .attr("r", outlierRadius)
                    .attr("id",currentVariableSelection[i])
                    .attr("class", "outliers");
        }
    }        
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
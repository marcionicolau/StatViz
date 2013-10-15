var max;
var min;

var data;
var iqr;

var topFringe;
var bottomFringe;

function makeBoxplot()
{
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        data[i] = variables[currentVariableSelection[i]];      
        mins[i] = MIN[currentVariableSelection[i]];      
        maxs[i] = MAX[currentVariableSelection[i]];      
        iqrs[i] = IQR[currentVariableSelection[i]];      
        medians[i] = median(data[i]);      
        means[i] = mean(data[i]);  
    }
    min = Array.min(mins);
    max = Array.max(maxs);
    
    var canvas = d3.select("#svgCanvas");

    // changeable
    var nGroovesY = 10;
    
    //draw axes
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 + size/2)
                                    .attr("x2", canvasWidth/2 + size/2)
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
                    .attr("x1", canvasWidth/2 - size/2 - 5)
                    .attr("y1", canvasHeight/2 + size/2 - i*yStep)
                    .attr("x2", canvasWidth/2 - size/2 + 5)
                    .attr("y2", canvasHeight/2 + size/2 - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 55)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep)                    
                    .text(format(min + i*slice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    var widthSlice = size/(currentVariableSelection.length+1);
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        canvas.append("rect")
                    .attr("x", canvasWidth/2 - size/2 + (i+1)*widthSlice - boxWidth/2)
                    .attr("y", canvasHeight/2 + size/2 - getValue(medians[i] + iqrs[i]/2)*size)
                    .attr("height", getValue(medians[i] + iqrs[i]/2)*size - getValue(medians[i] - iqrs[i]/2)*size)
                    .attr("width", boxWidth)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "IQRs");
                
        // median
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + (i+1)*widthSlice - boxWidth/2)
                    .attr("y1", canvasHeight/2 + size/2 - getValue(medians[i])*size)
                    .attr("x2", canvasWidth/2 - size/2 + (i+1)*widthSlice + boxWidth/2)
                    .attr("y2", canvasHeight/2 + size/2 - getValue(medians[i])*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "medians");
    
        //end fringes
        bottomFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
        topFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "topFringes");
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                    .attr("x2", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2- getValue(medians[i] + iqrs[i]/2)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "topFringeConnectors");    
    
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                    .attr("x2", canvasWidth/2 + boxWidth/4 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "bottomFringes");
                
        canvas.append("line")
                    .attr("x1", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y1", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                    .attr("x2", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("y2", canvasHeight/2 + size/2 - getValue(medians[i] - iqrs[i]/2)*size)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "bottomFringeConnectors");
    
        canvas.append("circle")
                    .attr("cx", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("cy", canvasHeight/2 + size/2 - getValue(means[i])*size)
                    .attr("r", "5px")
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "means");
    
        var outliers = getOutliers(data[i], topFringe, bottomFringe);
            
        for(var j=0; j<outliers.length; j++)
        {
            canvas.append("circle")
                    .attr("cx", canvasWidth/2 + (i+1)*widthSlice - size/2)
                    .attr("cy", canvasHeight/2 + size/2 - getValue(outliers[j])*size)
                    .attr("r", "3px")
                    .attr("id",currentVariableSelection[i])
                    .attr("class", "outliers");
        }
    }        
}

function getValue(number)
{
    return (number - min)/(max - min);
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
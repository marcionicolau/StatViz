var max;
var min;

var data;
var IQR;

function makeBoxPlot(variableName)
{
    data = variables[variableName];
    var canvas = d3.select("#svgCanvas");

    // changeable
    var size = 500;
    var nGroovesY = 10;
    var boxWidth = 100;
    
    IQR = IQR[variableName];
    
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
    min =Array.min(data);
    max = Array.max(data);
    

    
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
                    .attr("x", canvasWidth/2 - size/2 - 35)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep + 10)                    
                    .text(format(min + i*slice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    
    canvas.append("rect")
                .attr("x", canvasWidth/2 - boxWidth/2)
                .attr("y", canvasHeight/2 + size/2 - getValue(median(data) + IQR/2)*size)
                .attr("height", getValue(median(data) + IQR/2)*size - getValue(median(data) - IQR/2)*size)
                .attr("width", boxWidth)
                .attr("id", "IQR")
                .attr("class", "boxplot");
                
    // median
    canvas.append("line")
                .attr("x1", canvasWidth/2 - boxWidth/2)
                .attr("y1", canvasHeight/2 + size/2 - getValue(median(data))*size)
                .attr("x2", canvasWidth/2 + boxWidth/2)
                .attr("y2", canvasHeight/2 + size/2 - getValue(median(data))*size)
                .attr("id", "median")
                .attr("class", "boxplot");
    
    canvas.append("line")
                .attr("x1", canvasWidth/2 - boxWidth/4)
                .attr("y1", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                .attr("x2", canvasWidth/2 + boxWidth/4)
                .attr("y2", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                .attr("id", "topFringe")
                .attr("class", "boxplot");
    
    //end fringes
    var bottomFringe = (median(data) - 1.5*IQR) < min ? min : (median(data) - 1.5*IQR);
    var topFringe = (median(data) + 1.5*IQR) > max ? max : (median(data) + 1.5*IQR);
    
    canvas.append("line")
                .attr("x1", canvasWidth/2)
                .attr("y1", canvasHeight/2 + size/2 - getValue(topFringe)*size)
                .attr("x2", canvasWidth/2)
                .attr("y2", canvasHeight/2 + size/2- getValue(median(data) + IQR/2)*size)
                .attr("id", "topFringeConnector")
                .attr("class", "boxplot");    
    
    canvas.append("line")
                .attr("x1", canvasWidth/2 - boxWidth/4)
                .attr("y1", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                .attr("x2", canvasWidth/2 + boxWidth/4)
                .attr("y2", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                .attr("id", "bottomFringe")
                .attr("class", "boxplot");
                
    canvas.append("line")
                .attr("x1", canvasWidth/2)
                .attr("y1", canvasHeight/2 + size/2 - getValue(bottomFringe)*size)
                .attr("x2", canvasWidth/2)
                .attr("y2", canvasHeight/2 + size/2 - getValue(median(data) - IQR/2)*size)
                .attr("id", "bottomFringeConnector")
                .attr("class", "boxplot");
    
    canvas.append("circle")
                .attr("cx", canvasWidth/2)
                .attr("cy", canvasHeight/2 + size/2 - getValue(mean(data))*size)
                .attr("r", "5px")
                .attr("id", "mean")
                .attr("class", "boxplot");
    
    var outliers = getOutliers();
    
    console.log("median =" + median(data) + ", IQR = " + IQR + ", range = [" + (median(data) - IQR/2) + ", " + (median(data) + IQR/2) + "], end: [" + (bottomFringe) + ", " + (topFringe) + "]");   
    
    for(var i=0; i<outliers.length; i++)
    {
        canvas.append("circle")
                .attr("cx", canvasWidth/2)
                .attr("cy", canvasHeight/2 + size/2 - getValue(outliers[i])*size)
                .attr("r", "3px")
                .attr("id", "outliers")
                .attr("class", "boxplot");
    }
        
}

function getValue(number)
{
    return (number - min)/(max - min);
}

function getOutliers()
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
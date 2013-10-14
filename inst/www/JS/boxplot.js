function makeBoxPlot(variableName)
{
    var data = variables[variableName];
    var canvas = d3.select("#svgCanvas");

    // changeable
    var size = 500;
    var nGroovesY = 10;
    var boxWidth = 100;

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
    var min = Array.min(data);
    var max = Array.max(data);
    

    
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
                    .text(Math.round(min + i*slice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    // median
    console.log("median=" + median(data) + "; frac=" + median(data)/(max - min));
    
    canvas.append("line")
                .attr("x1", canvasWidth/2 - boxWidth/2)
                .attr("y1", canvasHeight/2 + size/2 - (median(data)/(max-min))*size)
                .attr("x2", canvasWidth/2 + boxWidth/2)
                .attr("y2", canvasHeight/2 + size/2 - (median(data)/(max-min))*size)
                .attr("id", "median")
                .attr("class", "boxplot");
    
    
    
}
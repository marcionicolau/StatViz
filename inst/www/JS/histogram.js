function makeHistogram(variableName)
{
    var data = variables[variableName];
    
    var svgCanvas = d3.select("body").append("svg");
    
    svgCanvas.attr("x", width*0.2)
                    .attr("y", 0)
                    .attr("height", height*(2/3))
                    .attr("width", width*0.8);
}
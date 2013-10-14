function makeHistogram(variableName)
{
    var data = variables[variableName];
    
    var svgCanvas = d3.select("body").append("svg");
    
    svgCanvas.attr("left", width*0.2 + "px")
                    .attr("top", 0 + "px")
                    .attr("height", height*(2/3))
                    .attr("width", width*0.8);
}
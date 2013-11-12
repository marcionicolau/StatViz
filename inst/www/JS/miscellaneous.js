function initiateLoadingDatasetAnimation()
{
    var canvas = d3.select("#svgCanvas");
    
            
    loadingDataAnimation = setInterval(function()
    {
        if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingAnimation");
            
        var t = canvas.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "32px")
            .text("Loading data")
            .attr("id", "loadingData")
            .attr("class", "loadingAnimation");
        
        t.transition().duration(700).attr("opacity", "0.3");
    }, 800);
            
}
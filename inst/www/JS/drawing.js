//drawing
function resetSVGCanvas()
{
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
            
    var plotCanvas = d3.select("#canvas").append("svg");
        
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", canvasWidth)
              .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
    
    if(document.getElementById("sideBarCanvas") != null)
        removeElementById("sideBarCanvas");
            
    var plotCanvas = d3.select("#sideBar").append("svg");
        
    plotCanvas.attr("id", "sideBarCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", sideBarWidth)
              .attr("viewBox", "0 0 " + sideBarWidth + " " + canvasHeight);
}

function drawFullScreenButton()
{
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("image")
                .attr("x", canvas.attr("width") - (fullScreenButtonSize + fullScreenButtonOffset))
                .attr("y", 0)
                .attr("xlink:href", "images/fullscreennormal.png")
                .attr("height", fullScreenButtonSize)
                .attr("width", fullScreenButtonSize)
                .attr("style", "opacity: 1.0;")
                .attr("class", "fullscreen");
}

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 1;
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("rect")
            .attr("x", 0)
            .attr("y", offset*buttonOffset)
            .attr("width", sideBarWidth)
            .attr("height", buttonHeight)
            .attr("rx", sideBarWidth/10)
            .attr("ry", sideBarWidth/10)
            .attr("fill", buttonColors["normal"])
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", offset*buttonOffset + buttonHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .text(buttonText)
            .attr("id", "text")
            .attr("class", className); 
}

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
            .attr("rx", "5")
            .attr("ry", "5")
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

function drawDialogBoxToGetOutcomeVariable()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "#5a4c29")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("SELECT THE OUTCOME VARIABLE")
            .attr("id", "regression")
            .attr("class", "dialogBox");
            
    var step = (dialogBoxHeight/2)/currentVariableSelection.length;
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        canvas.append("rect")
                .attr("x", centerX - dialogBoxWidth/3)
                .attr("y", i*step + yStart)
                .attr("width", 2*dialogBoxWidth/3)
                .attr("height", buttHeight)
                .attr("rx", scaleForWindowSize(10) + "px")
                .attr("ry", scaleForWindowSize(10) + "px")
                .attr("fill", panelColors["normal"])
                .attr("id", "button")
                .attr("class", "outcomeVariable")
                .attr("data-variable", currentVariableSelection[i]);
        canvas.append("text")
                .attr("x", centerX)
                .attr("y", i*step + yStart + buttHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "middle")
                .text(currentVariableSelection[i])
                .attr("font-size", fontSizeVariablePanel)
                .attr("id", "text")
                .attr("class", "outcomeVariable")
                .attr("data-variable", currentVariableSelection[i]);
    }
}

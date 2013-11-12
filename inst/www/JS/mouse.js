function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
   
    // for IE, left click == 1
    // for Firefox, left click == 0
   
    if((e.button == 1 && window.event != null || e.button == 0) && ((target.className.baseVal == "variableNameHolder") || (target.className.baseVal == "variableNameHolderText")))
    {
        setup(e, target);        
        
        //add to list of variables selected
        currentVariableSelection = addElementToArrayWithUniqueElements(currentVariableSelection, target.id);
        
        //display the current variable selection
        console.log("************************************************************************************************************************************************************");        
        console.log("\ncurrent variable selection: [" + currentVariableSelection + "]\n");
              
        pickOutVisualizations();      
        makePlot(); //checks which plot is selected and draws that plot
        toggleFillColorsForVisualizations(); //manages the fill colors of vizualizations (only one at a time)
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "visualizationHolderFront"))
    {
        setup(e, target);    
        currentVisualizationSelection = target.id;
        
        toggleFillColorsForVisualizations();        
        makePlot();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableSelectionButton"))
    {
        setup(e, target);    
        
        var variableSelectionButton = d3.selectAll("#" + target.id + ".variableSelectionButton");
        variableSelectionButton.attr("fill", panelColors["active"]);
        
        variableTypes[target.id] = "independent";        

        splitTheData();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "means")
    {
        setup(e, target);    
        
        var meanCircle = d3.selectAll("#" + target.id + ".means");
        
        if(document.getElementsByClassName("completeLines").length+1 < (document.getElementsByClassName("means").length))
        {
            meanCircle.attr("fill", meanColors["click"]);
            
            //check if we are finishing here
            
            var incompleteLines = d3.selectAll(".incompleteLines");
            
            if(document.getElementsByClassName("incompleteLines").length > 0)
            {            
                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                .attr("y2", meanCircle.attr("cy"))
                                .attr("stroke", meanColors["click"])
                                .attr("class", "completeLines");
            }
            
            var completeLines = d3.selectAll(".completeLines");
            
            if(document.getElementsByClassName("completeLines").length+1 < document.getElementsByClassName("means").length)
            {
                var canvas = d3.select("#svgCanvas");
                canvas.append("line")
                        .attr("x1", meanCircle.attr("cx"))
                        .attr("y1", meanCircle.attr("cy"))
                        .attr("x2", meanCircle.attr("cx"))
                        .attr("y2", meanCircle.attr("cy"))
                        .attr("stroke", meanColors["normal"])
                        .attr("stroke-dasharray", "5,5")
                        .attr("id", meanCircle.attr("id"))
                        .attr("class", "incompleteLines");
            }
            else
            {
                //we are done
                compareMeans();
            }
        }   
    }
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToNormal")
    {
        setup(e, target);
        
        var button = d3.select("#button." + target.className.baseVal);   
        var buttonText = d3.select("#text." + target.className.baseVal);
        
        if(button.attr("fill") == buttonColors["hover"])
        {
            button.attr("fill", buttonColors["click"]);
            
            var variableList = getSelectedVariables();
            
            for(var i=0; i<variableList["independent-levels"].length; i++)
            {                
                applyTransform(variableList["dependent"][0], variableList["independent-levels"][i], false);
            }
            
            applyTransform(variableList["dependent"][0], "dataset", true);
        }        
    }
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "fullscreen")
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
    //     document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        var button = d3.select(".fullscreen");
        
        if(button.attr("xlink:href") == "images/fullscreennormal.png")
        {
            fullScreen = true;
            button.attr("xlink:href", "images/fullscreenclick.png");
            d3.select("#variable.panel").attr("style", "width: " + 0 + "px; height: " + height + "px;"); 
            d3.select("#variablePanelSVG").attr("width", 0);            
            d3.select("#visualization.panel").attr("style", "height: " + 0 + "px;"); 
            d3.select("#visualizationPanelSVG").attr("height", 0);
            d3.select("#canvas").attr("style", "left: 0px; height: " + height + "px;");
            d3.select("#svgCanvas").attr("height", height).attr("width", width);
        }
        else if(button.attr("xlink:href") == "images/fullscreenclick.png")
        {
            fullScreen = false;
            button.attr("xlink:href", "images/fullscreennormal.png");
            d3.select("#variable.panel").attr("style", "width: " + (width - canvasWidth) + "px; height: " + height + "px;"); 
            d3.select("#variablePanelSVG").attr("width", (width - canvasWidth));            
            d3.select("#visualization.panel").attr("style", "width: " + canvasWidth + "px; height: " + height/3 + "px; top: " + canvasHeight + "px; left: " + (width - canvasWidth) + "px;");                    
            d3.select("#visualizationPanelSVG").attr("height", height/3);
            d3.select("#canvas").attr("style", "position: absolute; width: " + canvasWidth + "px; height: " + canvasHeight + "px; top: 0px; left: " + (width - canvasWidth) + "px;");    
            d3.select("#svgCanvas").attr("height", canvasHeight).attr("width", canvasWidth);
        }
    }
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "regression")
    {
        setup(e, target);
        
        var regressionCircle = d3.select("#circle.regression");
        var regressionText = d3.select("#text.regression");
        
        regressionCircle.transition().duration(2000).attr("opacity", "0.1");
        
        drawDialogBoxToGetCausalAndPredictorVariables();
    }
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "causalVariable")
    {
        setup(e, target);
        
        var choice = target.id;
        
        if(choice != currentVariableSelection[0])
        {   
            var temp = currentVariableSelection[1];
            currentVariableSelection[1] = currentVariableSelection[0];
            currentVariableSelection[0] = temp;
            
            makePlot("no");  
        }
        
        var variableList = sort(currentVariableSelection);
        
            console.log("finding the regression model between causal variable (" + currentVariableSelection[0] + ") and predictor variable (" + currentVariableSelection[1] + ")");
        
            //some interaction to get the variables :)
        
            removeElementsByClassName("causalVariable");
            removeElementsByClassName("dialogBox");
        
        setTimeout(function(){
            
            removeElementsByClassName("regression");
            removeElementsByClassName("significanceTest");
            getLinearModelCoefficients(currentVariableSelection[0], currentVariableSelection[1]);
        }, 300);        
    
    }
    else if((e.button == 1 && window.event != null || e.button == 0) && target.id == "regressionLine")
    {
        //TODO: fade out the datapoints
        setup(e, target);
        
        var canvas = d3.select("#svgCanvas");
        
        var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
        var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
        
        canvas.append("circle")
                .attr("cx", mouseX)
                .attr("cy", mouseY)
                .attr("r", "7px")
                .attr("fill", "steelblue")
                .attr("class", "regressionPredictionInstance");        
        
        
        if(mouseX < toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
        {
            console.log("left of x-axis");
        }
        if(mouseY > toModifiedViewBoxForRegressionLineXCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
        {
            console.log("bottom of y-axis");
        }
        
        canvas.append("line")
                .attr("x1", mouseX)
                .attr("y1", mouseY)
                .attr("x2", toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
                .attr("y2", mouseY)
                .attr("stroke", "purple")
                .attr("stroke-dasharray", "5,5")
                .attr("id", "x")
                .attr("class", "LineToAxisInstance");
                    
        canvas.append("line")
                .attr("x1", mouseX)
                .attr("y1", mouseY)
                .attr("x2", mouseX)
                .attr("y2", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
                .attr("stroke", "purple")
                .attr("stroke-dasharray", "5,5")
                .attr("id", "y")
                .attr("class", "LineToAxisInstance");
    }
    else
    {
        //the user clicked outside
        removeElementsByClassName("regressionPrediction");
        
        if(document.getElementsByClassName("incompleteLines").length > 0)
        {
            removeElementsByClassName("incompleteLines");
            
            if(document.getElementsByClassName("completeLines").length > 0)
            {
                compareMeans();
            }
            else
            {
                _dragElement.setAttribute("fill", meanColors["normal"]);
            }
        }   
    }
}
 
function OnMouseMove(e)
{
    if (e == null) 
    var e = window.event; 

    // this is the actual "drag code"
    
    
    if(_dragElement != undefined)
    {
        var incompleteLines = d3.selectAll(".incompleteLines");
        if((_dragElement.className.baseVal == 'means') && (document.getElementsByClassName("incompleteLines").length > 0) && incompleteLines.attr("stroke") == meanColors["normal"])
        {
            if(!fullScreen)
            {
                incompleteLines.attr("x2", e.pageX - (width - canvasWidth))
                        .attr("y2", e.pageY);
            }
            else
            {
                incompleteLines.attr("x2", (e.pageX/width) * canvasWidth)
                        .attr("y2", (e.pageY/height) * canvasHeight);
            }
        }
        if(_dragElement.id == "regressionLine")
        {
//             var regressionPoint = d3.select(".regressionPrediction");
//             
//             var xLine = d3.select("#x.lineToAxis");
//             var yLine = d3.select("#y.lineToAxis");
//             
//             var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
//             var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
//             
// //             xLine.attr("x1", ((height - mouseY) + testResults["intercept"])/testResults["slope"])
// //                                  .attr("y1", mouseY)                                                 
// //                                  .attr("y2", mouseY);
// //                          
// //             mouseX = ((canvasHeight - mouseY) + testResults["intercept"])/testResults["slope"];
// //             
// //     
// //             yLine.attr("x1", mouseX)
// //                  .attr("y1", height - (testResults["slope"]*mouseX - testResults["intercept"]))
// //                  .attr("x2", mouseX);
// 
// //             mouseY = toModifiedViewBoxForRegressionLineYCoordinate(testResults["slope"]*mouseX + testResults["intercept"]);
//             
//             mouseX = toModifiedViewBoxForRegressionLineXCoordinate(LEFT + getValue1(testResults["slope"]*(canvasHeight - mouseY) + testResults["intercept"], mins["X"], maxs["X"])*plotWidth);
//             
//             var canvas = d3.select("#svgCanvas");
//             
//             var dT = d3.select("#dummyText");
//             dT.text("X = " + mouseX + " , Y = " + mouseY);
//             
//             
//             regressionPoint.attr("cx", mouseX)
//                            .attr("cy", mouseY);
        }
        
    }

}

function OnMouseOver(e)			
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
            e = window.event; 

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    // for IE, left click == 1
    // for Firefox, left click == 0

    if(target.className.baseVal == "variableNameHolder")
    {		
        setup(e, target);
        
        var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
        variableNameHolder.attr("cursor","pointer");
    }
    else if(target.className.baseVal == "visualizationHolderFront")
    {		
        setup(e, target);
        
        var visualizationHolder = d3.selectAll("#" + target.id + ".visualizationHolderFront");
        visualizationHolder.attr("cursor","pointer");
    }
    else if(target.className.baseVal == "variableSelectionButton")
    {		
        setup(e, target);
        
        var variableSelectionButton = d3.selectAll("#" + target.id + ".variableSelectionButton");
        variableSelectionButton.attr("cursor","pointer");
    }
    else if(target.className.baseVal == "means")
    {		
        setup(e, target);
        console.log("you hovered on a mean with id = " + target.id);
        
        var meanCircle = d3.select("#" + target.id + ".means");
        
        if(document.getElementsByClassName("completeLines").length+1 < (document.getElementsByClassName("means").length))
        {
            
            meanCircle.attr("cursor","pointer");
        
            //change color of the mean circle
            if(meanCircle.attr("fill") == meanColors["normal"])
                meanCircle.attr("fill", meanColors["hover"]);
            
            startLoopAnimation(meanCircle);
            
            var incompleteLines = d3.selectAll(".incompleteLines");
            
            if(document.getElementsByClassName("incompleteLines").length > 0)
            {
                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                .attr("y2", meanCircle.attr("cy"))
                                .attr("stroke", meanColors["hover"]);
            }
        }
    }
    else if(target.className.baseVal == "bins")
    {		
        setup(e, target);
        
        highlightBinWithId(target.id);
    }   
    else if(target.className.baseVal == "datapoints")
    {		
        setup(e, target);
    
        var datapoint = d3.select("#" + target.id + ".datapoints");
        
        datapoint.transition().duration(300).attr("r", "5px");
        
        var altScatterPlot = false;
        var text = new Array();
        
        //Get data, minimums and maximums for each selected variable
        for(var i=0; i<currentVariableSelection.length; i++)
        {   
            if(variableTypes[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
            {
                // Levels are needed when we have a independent variable and one or more dependent variables
                levels = variables[currentVariableSelection[i]]["dataset"].unique();            
                altScatterPlot = true;
            }
        }
    
        for(var i=0; i<currentVariableSelection.length; i++)
        {        
            if(altScatterPlot)
            {
                if(variableTypes[currentVariableSelection[i]] != false)
                {
                    //for the dependent variable(s)
                
                    for(var j=0; j<levels.length; j++)
                    {
                        // for each level of the independent variable, find the dependent variables                    
                    
                        text[j] = variables[currentVariableSelection[i]][levels[j]];
                    }
                }  
            }
            else 
            {               
                text[i] = variables[currentVariableSelection[i]]["dataset"];                
            }             
        }
        
        var canvas = d3.select("#svgCanvas");
        canvas.append("text")
                .attr("x", e.pageX + 10 - (width - canvasWidth))
                .attr("y", e.pageY + 15)
                .attr("fill", meanColors["normal"])
                .text(text[0][removeAlphabetsFromString(datapoint.attr("id"))] + ", " + text[1][removeAlphabetsFromString(datapoint.attr("id"))])
                .attr("class", "hoverText");
                
        var xLine = canvas.append("line")
                .attr("x1", datapoint.attr("cx"))
                .attr("y1", datapoint.attr("cy"))
                .attr("x2", datapoint.attr("cx"))
                .attr("y2", datapoint.attr("cy"))
                .attr("stroke", meanColors["normal"])
                .attr("stroke-dasharray", "5,5")
                .attr("id", "x")
                .attr("class", "hoverText");
        
        xLine.transition().duration(500).attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset);
        
        var yLine = canvas.append("line")
                .attr("x1", datapoint.attr("cx"))
                .attr("y1", datapoint.attr("cy"))
                .attr("x2", datapoint.attr("cx"))
                .attr("y2", datapoint.attr("cy"))
                .attr("stroke", meanColors["normal"])
                .attr("stroke-dasharray", "5,5")
                .attr("id", "y")
                .attr("class", "hoverText");
        
        yLine.transition().duration(500).attr("y2", canvasHeight/2 + plotHeight/2 - topOffset + axesOffset);
                
        
    }   
    else if(target.className.baseVal == "transformToNormal")
    {
        setup(e, target);
        var button = d3.select("#button." + target.className.baseVal);   
        var buttonText = d3.select("#text." + target.className.baseVal);
        
        if(button.attr("fill") == buttonColors["normal"])
        {
            button.attr("fill", buttonColors["hover"]);
            button.attr("cursor", "pointer");
            buttonText.attr("cursor", "pointer");
        }        
    }
    else if(target.className.baseVal == "fullscreen")
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
    //     document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        var button = d3.select(".fullscreen");
        button.attr("cursor", "pointer");
    }
    else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
    {
        var canvas = d3.select("#svgCanvas");
        
        var topFringe = d3.select("#" + target.id + ".CITopFringes");
        var bottomFringe = d3.select("#" + target.id + ".CIBottomFringes");
    
        var variableList = sort(currentVariableSelection);
        
        var topLine = canvas.append("line")
                .attr("x1", (parseFloat(topFringe.attr("x1")) + parseFloat(topFringe.attr("x2")))/2)
                .attr("y1", topFringe.attr("y1"))
                .attr("x2", (parseFloat(topFringe.attr("x1")) + parseFloat(topFringe.attr("x2")))/2)
                .attr("y2", topFringe.attr("y1"))
                .attr("stroke", "black")
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
        
        var bottomLine = canvas.append("line")
                .attr("x1", (parseFloat(bottomFringe.attr("x1")) + parseFloat(bottomFringe.attr("x2")))/2)
                .attr("y1", bottomFringe.attr("y1"))
                .attr("x2", (parseFloat(bottomFringe.attr("x1")) + parseFloat(bottomFringe.attr("x2")))/2)
                .attr("y2", bottomFringe.attr("y1"))
                .attr("stroke", "black")
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
        
        topLine.transition().duration(1000)
                    .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset);
        
        bottomLine.transition().duration(1000)
                    .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset);
        
        canvas.append("text")
                .attr("x",(parseFloat(bottomFringe.attr("x1")) - 20))
                .attr("y", bottomFringe.attr("y1") - 5)
                .attr("text-anchor", "middle")
                .text(format(CI[variableList["dependent"][0]][target.id][0]))
                .attr("class", "hover");
        
        canvas.append("text")
                .attr("x",(parseFloat(topFringe.attr("x1")) - 20))
                .attr("y", topFringe.attr("y1") - 5)
                .attr("text-anchor", "middle")
                .text(format(CI[variableList["dependent"][0]][target.id][1]))
                .attr("class", "hover");
                
        
    }
    else if(target.className.baseVal == "regression")
    {
        var regressionElements = d3.selectAll(".regression").attr("cursor", "pointer");
    }
    else if(target.id == "regressionLine")
    {
        var regressionLine = d3.select("#regressionLine");
        regressionLine.attr("cursor", "pointer");   
        
        var interceptCircle = d3.select("#interceptCircle");
        var intercept = canvasHeight - interceptCircle.attr("cy");
        
        var canvas = d3.select("#svgCanvas");
        
        //t
        var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
        var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
        
        var slope = ((canvasHeight - regressionLine.attr("y2")) - (canvasHeight - regressionLine.attr("y1")))/(regressionLine.attr("x2") - regressionLine.attr("x1"));
        console.log("intercept=" + intercept + "\nslope=" + slope);
        
        canvas.append("line")
                .attr("x1", toModifiedViewBoxForRegressionLineXCoordinate((width - canvasWidth) + 0))
                .attr("y1", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight - 0))
                .attr("x2", toModifiedViewBoxForRegressionLineXCoordinate((width - canvasWidth) + canvasWidth))
                .attr("y2", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight - slope*((width - canvasWidth) + 0))))
                .attr("stroke", "red")
                .attr("stroke-width", "3px");

        canvas.append("circle")
                .attr("cx", toModifiedViewBoxForRegressionLineXCoordinate(0 + (width - canvasWidth)))
                .attr("cy", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight - 0))
                .attr("r", "20px")
                .attr("fill", "blue");
         
        mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
        // mouseY = ;
        
        canvas.append("circle")
                .attr("cx", mouseX)
                .attr("cy", mouseY)
                .attr("r", "7px")
                .attr("fill", "steelblue")
                .attr("class", "regressionPrediction");        

        

        
        
        if(mouseX < toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
        {
            console.log("left of x-axis");
        }
        if(mouseY > toModifiedViewBoxForRegressionLineXCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
        {
            console.log("bottom of y-axis");
        }
        
        canvas.append("line")
                .attr("x1", mouseX)
                .attr("y1", mouseY)
                .attr("x2", toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
                .attr("y2", mouseY)
                .attr("stroke", "purple")
                .attr("stroke-dasharray", "5,5")
                .attr("id", "x")
                .attr("class", "lineToAxis");
                    
        canvas.append("line")
                .attr("x1", mouseX)
                .attr("y1", mouseY)
                .attr("x2", mouseX)
                .attr("y2", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
                .attr("stroke", "purple")
                .attr("stroke-dasharray", "5,5")
                .attr("id", "y")
                .attr("class", "lineToAxis");
    }
    else if(target.className.baseVal == "causalVariable")
    {
        var choice = d3.selectAll("#" + target.id + ".causalVariable");
        choice.attr("cursor", "pointer");
        
        choice.attr("stroke", "black").attr("stroke-width", "2px");
    }
}

function OnMouseOut(e)
{    
    var target = e.target != null ? e.target : e.srcElement;
                
    if(target.className.baseVal == "variableNameHolder")                
    {
        var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
    }
    else if(target.className.baseVal == "visualizationHolder")                
    {
        var visualizationHolder = d3.selectAll("#" + target.id + ".visualizationHolder");
    }
    else if(target.className.baseVal == "means")                
    {
        var meanCircle = d3.selectAll("#" + target.id + ".means");
        
        if(meanCircle.attr("fill") != meanColors["click"])
        {
            meanCircle.attr("fill", meanColors["normal"]);
        }
        removeElementsByClassName("loops");
        
        
        clearInterval(intervals[meanCircle.attr("id")]);
        
        var incompleteLines = d3.selectAll(".incompleteLines");
            
        if(document.getElementsByClassName("incompleteLines").length > 0)
        {
            incompleteLines.attr("stroke", meanColors["normal"]);
        }   
    }
    else if(target.className.baseVal == "bins")                
    {
        var bins = d3.selectAll(".bins");
        
        unhighlightBins();
    }
    else if(target.className.baseVal == "datapoints")                
    {
        var datapoint = d3.select("#" + target.id + ".datapoints");
        
        datapoint.transition().duration(300).attr("r", datapointRadius);
        removeElementsByClassName("hoverText");
    }
    else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
    {
        removeElementsByClassName("hover");
    }
    else if((target.id == "regressionLine"))
    {
        removeElementsByClassName("regressionPrediction");
        removeElementsByClassName("lineToAxis")
    }
    
}	
	

function setup(e, target)
{
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;

    // grab the clicked element's position
    _offsetX = removeAlphabetsFromString(target.style.left);
    _offsetY = removeAlphabetsFromString(target.style.top);      

    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = +1;

    // we need to access the element in OnMouseMove
    _dragElement = target;

    // tell our code to start moving the element with the mouse
    document.onmousemove = OnMouseMove;

    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    document.onselectstart = function () { return false; };
    // prevent IE from trying to drag an image
    target.ondragstart = function() { return false; };		
}
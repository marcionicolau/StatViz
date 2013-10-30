function InitializeMouseEventHandlers()
{
    document.onmousedown = OnMouseDown;
    document.onmousemove = OnMouseMove;
    document.onmouseover = OnMouseOver;
    document.onmouseout = OnMouseOut;
}

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
        currentVariableSelection = addToArray(currentVariableSelection, target.id);
        
    
        console.log("************************************************************************************************************************************************************");
        
        console.log("\ncurrent variable selection: [" + currentVariableSelection + "]\n");
                            
        makePlot();
        toggleFillColors();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && ((target.className.baseVal == "visualizationHolder") || (target.className.baseVal == "visualizationHolderText") || (target.className.baseVal == "visualizationHolderImage")))
    {
        setup(e, target);    
        currentVisualizationSelection = target.id;
        toggleFillColors();
        
        makePlot();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableSelectionButton"))
    {
        setup(e, target);    
        
        var variableSelectionButton = d3.selectAll("#" + target.id + ".variableSelectionButton");
        variableSelectionButton.attr("fill", panelColors["active"]);
        
        variableTypes[target.id] = "independent";
        
        remove("variable");
        remove("visualization");
        
        
        var uniqueData = variables[target.id]["dataset"].unique();        
                
        for(var i=0; i<uniqueData.length; i++)
        {
            splitDataByColumnName(dataset, target.id, uniqueData[i]);                                                    
        }
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "means")
    {
        setup(e, target);    
        
        var meanCircle = d3.selectAll("#" + target.id + ".means");
        
        if(meanCircle.attr("fill") == meanColors["hover"])
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
            
            if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
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
    else
    {
        //the user clicked outside
        
        if(document.getElementsByClassName("incompleteLines").length > 0)
        {
            removeElementsByClassName("incompleteLines");
            
            if(document.getElementsByClassName("completeLines").length > 0)
            {
                compareMeans();
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
            incompleteLines.attr("x2", e.pageX - (width - canvasWidth))
                        .attr("y2", e.pageY);
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
    else if(target.className.baseVal == "visualizationHolder")
    {		
        setup(e, target);
        
        var visualizationHolder = d3.selectAll("#" + target.id + ".visualizationHolder");
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
        
        var meanCircle = d3.select("#" + target.id + ".means");
        
        if(meanCircle.attr("fill") == meanColors["normal"])
        {
            
            meanCircle.attr("cursor","pointer");
        
            //change color of the mean circle
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
        
        datapoint.transition().duration(300).attr("r", "5px").attr("fill", meanColors["normal"]);
        
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
                .text(text[0][getNumber(datapoint.attr("id"))] + ", " + text[1][getNumber(datapoint.attr("id"))])
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
        
        xLine.transition().duration(500).attr("x2", canvasWidth/2 - size/2 - axesOffset);
        
        var yLine = canvas.append("line")
                .attr("x1", datapoint.attr("cx"))
                .attr("y1", datapoint.attr("cy"))
                .attr("x2", datapoint.attr("cx"))
                .attr("y2", datapoint.attr("cy"))
                .attr("stroke", meanColors["normal"])
                .attr("stroke-dasharray", "5,5")
                .attr("id", "y")
                .attr("class", "hoverText");
        
        yLine.transition().duration(500).attr("y2", canvasHeight/2 + size/2 + axesOffset);
                
        
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
        
        datapoint.transition().duration(300).attr("r", datapointRadius).attr("fill", "black");
        removeElementsByClassName("hoverText");
    }
    
}	
	

function setup(e, target)
{
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;

    // grab the clicked element's position
    _offsetX = getNumber(target.style.left);
    _offsetY = getNumber(target.style.top);      

    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = +1;

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
}
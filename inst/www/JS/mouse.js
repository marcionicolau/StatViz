var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag		



function InitMouseGestures()
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
   
    if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "variableNameHolder")
    {
        setup(e, target);        
        
        //add to list of variables selected
        currentVariableSelection = addToArray(currentVariableSelection, target.id);
        console.log(currentVariableSelection);
                            
        makePlot();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "visualizationHolder")
    {
        setup(e, target);    
        currentVisualizationSelection = target.id;
        toggleFillColors();
        
        makePlot();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "means")
    {
        setup(e, target);    
        
        var meanCircle = d3.selectAll("#" + target.id + ".means");
        
        if(meanCircle.attr("fill") == meanColors["hover"])
        {
            meanCircle.attr("fill", meanColors["click"]);
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
        // yet to find a mouse move :)
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
    else if(target.className.baseVal == "means")
    {		
        setup(e, target);
        
        var meanCircle = d3.select("#" + target.id + ".means");
        
        if(meanCircle.attr("fill") == meanColors["normal"])
        {
            console.log("test");
            
            meanCircle.attr("cursor","pointer");
        
            //change color of the mean circle
            meanCircle.attr("fill", meanColors["hover"]);
            var canvas = d3.select("#svgCanvas");
        
            //insert animation
            
            bubbles = setInterval(function()
            {						
               var loop = canvas.append("circle")
                             .attr("cx", meanCircle.attr("cx"))
                             .attr("cy", meanCircle.attr("cy"))
                             .attr("r", "0px")
                             .attr("fill", "none")
                             .attr("style", "z-index: -1;")
                             .attr("stroke", "black")
                             .attr("stroke-width", "2px")				
                             .attr("class", "loops");

               loop.transition().duration(1500).attr("r", "25px").attr("opacity", "0.5").attr("stroke","lightgrey");
               loop.transition().delay(2500).attr("opacity", "0");
            },700);
        }
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
        removeElementsByClass("loops");
        
        clearInterval(bubbles);
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
    document.onmousemove = OnMouseMove;

    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    document.onselectstart = function () { return false; };
    // prevent IE from trying to drag an image
    target.ondragstart = function() { return false; };		
}
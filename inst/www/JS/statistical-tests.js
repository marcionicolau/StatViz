function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    
    switch(document.getElementsByClassName("completeLines").length)
    {
        case 1:
                //T-test
                {
                    console.log("\t Significance test for 2 variables...\n\n");

                    //homoscedasticity
                    var variableList = getSelectedVariables();
                    loadAssumptionCheckList();
                    
                    var sampleSize = variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length;
                    
                    if(sampleSize < 20)
                    {
                        console.log("sample size < 20!");
                        performHomoscedasticityTestNotNormal(variableList["dependent"][0], variableList["independent"][0]);
                    }
                    else
                    {
                        performNormalityTests(); 
                    }
                    
                    break;
                }
        
        default:
                //ANOVA
                {
                    console.log("\t Significance test for more than 2 variables...\n\n");
                                        
                    var variableList = getSelectedVariables();
                    console.dir(variableList);
                    
                    loadAssumptionCheckList();
                    
                    performNormalityTests();
        
                    break;
                }
    }
}

function loadAssumptionCheckList()
{
    var canvas = d3.select("#svgCanvas");
    
    for(var i=0; i<assumptions.length; i++)
    {
        canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2)
            .attr("y", canvasHeight/2 - plotHeight/2 +i*assumptionsSpace)
            .attr("font-size", "20px")
            .attr("fill", meanColors["normal"])
            .text(assumptionsText[assumptions[i]])
            .attr("id", assumptions[i])
            .attr("class", "assumptions");
        canvas.append("image")
            .attr("x", canvasWidth/2 + plotWidth/2 - assumptionImageSize)
            .attr("y", canvasHeight/2 - plotHeight/2 + i*assumptionsSpace - assumptionImageSize/2 - 10)
            .attr("text-anchor", "end")
            .attr("xlink:href", "images/tick.png")
            .attr("height", assumptionImageSize)            
            .attr("width", assumptionImageSize)
            .attr("display", "none")
            .attr("id", assumptions[i])
            .attr("class", "ticks");
        canvas.append("image")
            .attr("x", canvasWidth/2 + plotWidth/2 - assumptionImageSize)
            .attr("y", canvasHeight/2 - plotHeight/2 + i*assumptionsSpace - assumptionImageSize/2 - 10)
            .attr("text-anchor", "end")
            .attr("xlink:href", "images/cross.png")
            .attr("height", assumptionImageSize)
            .attr("width", assumptionImageSize)
            .attr("display", "none")
            .attr("id", assumptions[i])
            .attr("class", "crosses");
    }
}

function performNormalityTests()
{
    var variableList = getSelectedVariables();
    
    //normality
    distributions[variableList["dependent"][0]] = {};

    for(var i=0; i<variableList["dependent"].length; i++)                        
    {
        for(var j=0; j<variableList["independent-levels"].length; j++)
        {                            
            performNormalityTest(variables[variableList["dependent"][i]][variableList["independent-levels"][j]], variableList["dependent"][i], variableList["independent-levels"][j]);
        }
    }
}

function setDistribution(dependentVariable, level, normal)
{    
    if(distributions[dependentVariable] == undefined)
        distributions[dependentVariable] = new Object();
    
    distributions[dependentVariable][level] = normal;
    
    if(getObjectLength(distributions[dependentVariable]) == (document.getElementsByClassName("completeLines").length + 1))
    {       
        var variableList = getSelectedVariables();
        var normal = true;
        
        for(var i=0; i<variableList["independent-levels"].length; i++)
        {   
            if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
            {
                d3.select("#normality.crosses").attr("display", "inline");                  
                normal = false;

                //draw boxplots in red 
                d3.select("#svgCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                
                drawBoxPlotInRed(dependentVariable, variableList["independent-levels"][i]);
                drawNormalityPlot(dependentVariable, variableList["independent-levels"][i]);
            }
        }
        
        if(normal)
        {         
            console.log("\n\tall distributions are normal!");
            
            d3.select("#normality.ticks").attr("display", "inline");  
            performHomoscedasticityTestNormal(variableList["dependent"][0], variableList["independent"][0]);
        }
        else
        {
            console.log("\n\tchecking if normality transform is possible...");            
            findTransform(variableList["dependent"][0], variableList["independent"][0]);
        }
    }    
}

function drawNormalityPlot(dependentVariable, level)
{
    //make histogram with these variables in a separate svg
    var mean = d3.select("#" + level + ".means");
    var centerX = mean.attr("cx");   
    
    
    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level);//left, top, histWidth, histHeight, dependentVariable, level;
}
  
function displaySignificanceTestResults()
{    
    var cx = [];
    var cy = [];

    var means = document.getElementsByClassName("means");
    var meanRefLines = [];
    
    var svg = d3.select("#svgCanvas");

    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {								
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = svg.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            svg.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("opacity", "0.45")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
        }
        else
        {									
            cx.splice(i, 1);
            cy.splice(i, 1);								
        }	
    }
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 

    var differenceLine = svg.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "DOM");

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = svg.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "DOM");
    
    drawScales(cx, cy);    
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#svgCanvas");
    canvas.append("line")
            .attr("x1", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
            .attr("y1", yMin)
            .attr("x2", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
            .attr("y2", yMax)
            .attr("stroke", meanColors["normal"])
            .attr("id", "mainScale")
            .attr("class", "significanceTestScale");            
    
    var x = canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset;
    if(cx.length < 5)
    {
        for(var i=0; i<cx.length; i++)
        {        
            canvas.append("line")
                    .attr("x1", x-5)
                    .attr("y1", cy[i])
                    .attr("x2", x)
                    .attr("y2", cy[i])
                    .attr("stroke", meanColors["normal"])
                    .attr("id", "tick")
                    .attr("class", "significanceTestScale");       
        }
    }  
    
    var variableList = getSelectedVariables();
    var means = [];
    
    var levels = variables[variableList["independent"][0]]["dataset"].unique();
    
    for(var i=0; i<variableList["dependent"].length; i++)
    {
        for(var j=0; j<levels.length; j++)
        {
            means.push(mean(variables[variableList["dependent"][i]][levels[j]]));
        }
    }   
    
    
    if(cx.length == 2)
    {        
        canvas.append("text")
                .attr("x", x + 5)
                .attr("y", (yMin + yMax)/2)
                .attr("fill", meanColors["normal"])
                .attr("id", "tickText")
                .attr("class", "significanceTestScaleText")
                .text(format(means[1] - means[0]));
    }           
}
function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();    
    console.dir(variableList);
    
    switch(document.getElementsByClassName("completeLines").length)
    {

        case 0:
                //One sample t-test
                if(variableList["dependent"].length == 1)
                {
                    loadAssumptionCheckList();
                    performNormalityTest(variables[variableList["dependent"][0]]["dataset"], variableList["dependent"][0], "dataset");                    
                }
                
                break;
        case 1:
                //T-test
                {
                    console.log("\t Significance test for 2 variables...\n\n");

                    //homoscedasticity
                    loadAssumptionCheckList();
                    
                    
                    var sampleSize;
                    
                    if(variableList["independent"].length == 2)
                    {
                        var levelsOfIndependentVariableA = variables["independent-levels"][0];
                        var levelsOfIndependentVariableB = variables["independent-levels"][1];
                        
                        sampleSize = colourBoxPlotData[levelsOfIndependentVariableA[0]][levelsOfIndependentVariableB[0]];
                    }
                    else
                    {
                        sampleSize = variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length;
                    }
                    
                    
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
                    
                    loadAssumptionCheckList();                    
                    performNormalityTests();
        
                    break;
                }
    }
}

function loadAssumptionCheckList()
{
    var canvas = d3.select("#plotCanvas");
    
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
    
    if(variableList["independent"].length == 2)
    {
        variableList = sort(currentVariableSelection);
        for(var i=0; i<variableList["independent-levels"][0].length; i++)
        {
            for(var j=0; j<variableList["independent-levels"][1].length; j++)
            {
                performNormalityTest(colourBoxPlotData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]], variableList["dependent"][0], (variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]));
            }
        }
    }
    else
    {
        for(var i=0; i<variableList["dependent"].length; i++)                        
        {
            for(var j=0; j<variableList["independent-levels"].length; j++)
            {   
                //performNormalityTest(dist, dependentVariable, level)
                performNormalityTest(variables[variableList["dependent"][i]][variableList["independent-levels"][j]], variableList["dependent"][i], variableList["independent-levels"][j]);
            }
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
                
                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                
                //draw boxplots in red 
                drawBoxPlotInRed(variableList["independent-levels"][i]);
                drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "notnormal");
            }
        }
        
        if(normal)
        {         
            console.log("\n\tall distributions are normal!");
            
            d3.select("#normality.ticks").attr("display", "inline");  
            
            for(var i=0; i<variableList["independent"].length; i++)
            {
                performHomoscedasticityTestNormal(variableList["dependent"][0], variableList["independent"][i]);
            }
        }
        else
        {
            console.log("\n\tchecking if normality transform is possible...");            
            findTransform(variableList["dependent"][0], variableList["independent"][0]);
        }
    }    
}

function setHomogeneityOfVariances(dependentVariable, independentVariable, homogeneous)
{    
    if(variances[dependentVariable] == undefined)
        variances[dependentVariable] = new Object();
    
    variances[dependentVariable][independentVariable] = homogeneous;

    
    if(getObjectLength(variances[dependentVariable]) == (currentVariableSelection.length - 1))
    {       
        var variableList = sort(currentVariableSelection);
        var homogeneous = true;
        
        for(var i=0; i<variableList["independent"].length; i++)
        {   
            if(variances[dependentVariable][variableList["independent"][i]] == false)
            {
                d3.select("#homogeneity.crosses").attr("display", "inline");                  
                homogeneity = false;
            }
        }
        
        if(homogeneity)
        {         
            console.log("\n\tHomogeneous requirement satisfied!");
            
            d3.select("#homogeneous.ticks").attr("display", "inline");  
            performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
        }
        else
        {
            console.log("Friedman's test");
        }
    }    
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //9make histogram with these variables in a separate svg
    
    var mean;
    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var centerX = mean.attr("cx");   
    
    
    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;
}

function displayOneSampleTestResults()
{    
    var cx = [];
    var cy = [];

    removeElementsByClassName("significanceTest");
    
    var means = document.getElementsByClassName("means");
    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {								
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
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
    var cyMax = parseFloat(cy[0]);
    var cyMin = parseFloat(cy[0]); 

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
        
    var spaceOnRight = (canvasWidth - plotWidth)/2;
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", cyMax + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", cyMax + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", cyMax + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text("p = " + testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", (cyMin + cyMax)/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest");
}
  
function displaySignificanceTestResults()
{    
    var cx = [];
    var cy = [];

    removeElementsByClassName("significanceTest");
    
    var means = document.getElementsByClassName("means");
    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {								
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
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

    var differenceLine = canvas.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
    
    drawScales(cx, cy); 
    
    
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text("p = " + testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest");
    
    sideBar.append("circle")
            .attr("cx", sideBarWidth/2)
            .attr("cy", 2*significanceTestResultOffset)
            .attr("r", 50)
            .attr("id", "tukey")
            .attr("class", "significance"); 
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", 2*significanceTestResultOffset-6)
            .attr("fill", "white")
            .text("Tukey's HSD")
            .attr("id", "tukey")
            .attr("class", "significance"); 
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#plotCanvas");
    canvas.append("line")
            .attr("x1", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
            .attr("y1", yMin)
            .attr("x2", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
            .attr("y2", yMax)
            .attr("stroke", meanColors["normal"])
            .attr("id", "mainScale")
            .attr("class", "significanceTest");            
    
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
                    .attr("class", "significanceTest");       
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
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    if(cy.length == 2)
    {
        
        canvas.append("text")
                .attr("x", x + 5)
                .attr("y", (yMin + yMax)/2)
                .attr("fill", meanColors["normal"])
                .attr("id", "tickText")
                .attr("class", "significanceTest")
                .text(format(means[1] - means[0]));
    }    
    else
    {
        for(var i=0; i<cy.length; i++)
        {   
            if(i == 0)
            {
                canvas.append("text")
                    .attr("x", x + 5)
                    .attr("y", cy[i])
                    .attr("fill", meanColors["normal"])
                    .attr("id", "tickText")
                    .attr("class", "significanceTest")
                    .text(0);
            }
            else
            {
                canvas.append("text")
                    .attr("x", x + 5)
                    .attr("y", cy[i])
                    .attr("fill", meanColors["normal"])
                    .attr("id", "tickText")
                    .attr("class", "significanceTest")
                    .text(format(means[i] - means[0]));
            }
        }           
    }
}

function displayCorrelationResults()
{   
    var canvas = d3.select("#plotCanvas");    
    var spaceOnRight = (canvasWidth - plotWidth)/2;    
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text("p = " + testResults["p"])
            .attr("class", "significanceTest");    
    
    //Effect sizes
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 - 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest");
 
}

function displayBiserialCorrelationResults()
{   
    var canvas = d3.select("#plotCanvas");    
    var spaceOnRight = (canvasWidth - plotWidth)/2;    
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");  
    
    //Effect sizes
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 - 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest"); 
}

function displaySimpleRegressionResults()
{   
    var canvas = d3.select("#plotCanvas");    
    var spaceOnRight = (canvasWidth - plotWidth)/2;
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest");
    
    //Effect sizes
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 - 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest");
 
}

function displayMultipleRegressionResults()
{   
    var canvas = d3.select("#plotCanvas");
    
    canvas.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*(TOP+BOTTOM)/4 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    canvas.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*(TOP+BOTTOM)/4 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest");    
    
    //Effect sizes
    canvas.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*(TOP+BOTTOM)/4 - 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "orange")
            .text(testResults["effect-size"])
            .attr("class", "significanceTest");
 
}

function alertPossibleRegressionModel()
{
    var canvas = d3.select("#plotCanvas");    
    var spaceOnRight = (canvasWidth - plotWidth)/2;    
    
    canvas.append("circle")
            .attr("cx", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("cy", canvasHeight/2 - 4*significanceTestResultOffset)
            .attr("r", "20px")
            .attr("id", "circle")
            .attr("class", "regression");
            
    canvas.append("text")
            .attr("x", canvasWidth/2 + plotWidth/2 + spaceOnRight/2)
            .attr("y", canvasHeight/2 - 4*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "orange")
            .text("!")
            .attr("id", "text")
            .attr("class", "regression"); 
}
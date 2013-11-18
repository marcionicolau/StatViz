function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();    
    
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
                    var sampleSizesAreEqual = true;
                    
                    if(variableList["independent"].length == 2)
                    {
                        var levelsOfIndependentVariableA = variables["independent-levels"][0];
                        var levelsOfIndependentVariableB = variables["independent-levels"][1];
                        
                        sampleSize = colourBoxPlotData[levelsOfIndependentVariableA[0]][levelsOfIndependentVariableB[0]].length;
                    }
                    else
                    {
                        sampleSize = variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length;
                        
                        sampleSizesAreEqual = variables[variableList["dependent"][0]][variableList["independent-levels"][1]].length == variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length ? true : false;
                    }
                    
                    if(!sampleSizesAreEqual && experimentalDesign=="Between-groups")
                    {
                        console.log("no valid tests available");
                        return;
                    }                    
                    else if(sampleSize < 20)
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
    var canvas = d3.select("#sideBarCanvas");
    
    for(var i=0; i<assumptions.length; i++)
    {
        canvas.append("text")
            .attr("x", assumptionImageSize*1.25)
            .attr("y", i*30 + assumptionOffsetTop)
            .attr("font-size", fontSizeAssumptions + "px")
            .attr("fill", meanColors["normal"])
            .text(assumptionsText[assumptions[i]])
            .attr("id", assumptions[i])
            .attr("class", "assumptions");
        canvas.append("image")
            .attr("x", 0)
            .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
            .attr("text-anchor", "end")
            .attr("xlink:href", "images/tick.png")
            .attr("height", assumptionImageSize)            
            .attr("width", assumptionImageSize)
            .attr("display", "none")
            .attr("id", assumptions[i])
            .attr("class", "ticks");
        canvas.append("image")
            .attr("x", 0)
            .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
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

    sideBar = d3.select("#sideBarCanvas");
    
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
    
    
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#plotCanvas");
//     canvas.append("line")
//             .attr("x1", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
//             .attr("y1", yMin)
//             .attr("x2", canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset)
//             .attr("y2", yMax)
//             .attr("stroke", meanColors["normal"])
//             .attr("id", "mainScale")
//             .attr("class", "significanceTest");            
    
    var x = canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset;
    for(var i=0; i<cx.length; i++)
    {        
//         canvas.append("line")
//                 .attr("x1", x-5)
//                 .attr("y1", cy[i])
//                 .attr("x2", x)
//                 .attr("y2", cy[i])
//                 .attr("stroke", meanColors["normal"])
//                 .attr("id", "tick")
//                 .attr("class", "significanceTest");       
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
    
    
    // canvas.append("text")
//                 .attr("x", x + scaleForWindowSize(5))
//                 .attr("y", (yMin + yMax)/2)
//                 .attr("fill", meanColors["normal"])
//                 .attr("id", "tickText")
//                 .attr("class", "significanceTest")
//                 .text(format(means[1] - means[0]));
    
    if(cy.length > 2)
    {
        for(var i=0; i<cy.length-1; i++)
        {  
            canvas.append("text")
                .attr("x", x + scaleForWindowSize(5))
                .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                .attr("fill", meanColors["normal"])
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeansText")
                .attr("display", "none")
                .text(format(means[i+1] - means[i]));
                
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i])
                .attr("stroke", meanColors["normal"])
                .attr("stroke-width", scaleForWindowSize(5) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
            
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i+1])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", meanColors["normal"])
                .attr("stroke-width", scaleForWindowSize(5) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans"); 
            
            canvas.append("line")
                .attr("x1", x)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", meanColors["normal"])
                .attr("stroke-width", scaleForWindowSize(5) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
        }           
    }
}

function displayCorrelationResults()
{ 
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
 
}

function displayBiserialCorrelationResults()
{   
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
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
}

function displaySimpleRegressionResults()
{   
    var sideBar = d3.select("#sideBarCanvas");    
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
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
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight + 2*axesOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "32px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest");
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    //predictor variable
    var tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[0] + ":");
    tr.append("td").append("input")
                .attr("type", "text")
                .attr("placeholder", "<Enter value here>") 
                .attr("onchange", "calculateOutcome()")
                .attr("id", "value_" + currentVariableSelection[0]);
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[1] + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}

function displayMultipleRegressionResults()
{   
    var sideBar = d3.select("#sideBarCanvas");    
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
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
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*plotHeight/4)
            .attr("text-anchor", "middle")
            .attr("font-size", "32px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest"); 
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    var outcomeVariable = testResults["outcomeVariable"];
    var explanatoryVariables = testResults["explanatoryVariables"];
    
    for(var i=0; i<explanatoryVariables.length; i++)
    {
        //predictor variable
        var tr = table.append("tr");
    
        tr.append("td").append("label")
                    .text(explanatoryVariables[i] + ":");
        tr.append("td").append("input")
                    .attr("type", "text")
                    .attr("placeholder", "<Enter value here>") 
                    .attr("onchange", "calculateOutcome()")
                    .attr("id", "value_" + explanatoryVariables[i]);
    }
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(outcomeVariable + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}
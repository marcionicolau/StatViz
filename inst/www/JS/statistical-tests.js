function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    
    switch(document.getElementsByClassName("completeLines").length)
    {
        case 1:
                //T-test
                {
                    console.log("\t Performing T-test...\n\n");
                    
                    //homoscedasticity
                    var variableList = getSelectedVariables();
                    
                    for(var i=0; i<variableList["independent"].length; i++)
                    {
                        for(var j=0; j<variableList["dependent"].length; j++)
                        {
                            performHomoscedasticityTest(variableList["dependent"][j], variableList["independent"][i]);
                        }
                    }
                    
                    //normality
                    for(var i=0; i<variableList["dependent"].length; i++)
                    {
                        performNormalityTest(variableList["dependent"][i]);
                    }
                    var option = "parametric";
                    var levels = variables[variableList["independent"][0]]["dataset"].unique();
                    
                    if(option == "parametric")
                    {                                                    
                        console.log(variables[variableList["dependent"][0]][levels[0]] + ",\n" + variables[variableList["dependent"][0]][levels[1]])
                        performTTest(variables[variableList["dependent"][0]][levels[0]], variables[variableList["dependent"][0]][levels[1]]);                        
                    }
                    
                    break;
                }
        
        default:
                //ANOVA
                {
                    console.log("\t Performing ANOVA test...\n\n");
                                        
                    var variableList = getSelectedVariables();
                    
                    //homoscedasticity
                    performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]); 
                                        
                    //normality                    
                    for(var i=0; i<variableList["dependent"].length; i++)                        
                    {
                        for(var j=0; j<variableList["independent-levels"].length; j++)
                        {
                            // console.log("variables[variableList[\"dependent\"][i]][variableList[\"independent-levels\"][j]] = " + variables[variableList["dependent"][i]][variableList["independent-levels"][j]]);
                            performNormalityTest(variables[variableList["dependent"][i]][variableList["independent-levels"][j]], variableList["dependent"][i] + "." + variableList["independent-levels"][j]);
                        }
                    }
                    
                    
                    var option = "parametric";
                    
                    if(option == "parametric")
                    {                                                    
                        performANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }
                    
                    break;
                }
    }
}

function performHomoscedasticityTest(dependent, independent)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                  }, function(output) {                                 
                  
                  console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                  console.log("\t\t\t p = " + output.p);
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performNormalityTest(dist, varName)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performShapiroWilkTest", {
                    distribution: dist                                                           
                  }, function(output) {                                                   
                  
                  console.log("\t\t Shapiro-wilk test for (" + varName + ")");
                  console.log("\t\t\t p = " + output.p);
                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performTTest(group1, group2)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performTTest", {
                    dataset: dataset,
                    group1: group1,
                    group2: group2                   
                  }, function(output) {                                                   
                  
                  console.log("\t\t T-test for (" + group1 + ", " + group2 + ")");
                  console.log("\t\t\t t = " + output.t);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used= " + output.method);
                  console.log("\t\t\t DF = " + output.DOF);

                  
                  testResults["t"] = output.t;
                  testResults["p"] = output.p;
                  testResults["grandMean"] = output.mean;
                  testResults["method"] = output.method;
                  testResults["df"] = output.DOF;                  
                  
                  getDFromT(group1.length);                  
                  
                //drawing stuff
                removeElementsByClass("completeLines");           

                tTest();
                
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performANOVA(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performANOVA", {
                    dataset: dataset,
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable                   
                  }, function(output) {                                                   
                  
                  console.log("\t\t ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used= ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.DOF);
                  
                  testResults["F"] = output.F;
                  testResults["p"] = output.p;                  
                  testResults["df"] = output.DOF;
                  testResults["method"] = "ANOVA"; //todo
                           
                  
                //drawing stuff
                removeElementsByClass("completeLines");           

                ANOVA();                
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function getDFromT(n)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getDFromT", {
                    t: testResults["t"],                   
                    n1: n,
                    n2: n
                  }, function(output) {                                                   
                  
                  console.log("Cohen's d: " + output.d);
                  
                  testResults["d"] = output.d;
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function tTest()
{
//     setOpacityForElementsWithClassName("fade", "1.0");
    
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
                                 .attr("x2", canvasWidth/2 + size/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            svg.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("opacity", "0.25")
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
                            .attr("x1", canvasWidth/2 + size/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + size/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "DOM");

    var x = canvasWidth/2 + size/2;
    var y = cyMin;			 
    var head = svg.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "DOM");
    
    drawScales(cx, cy);    
}

function ANOVA()
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
                                 .attr("x2", canvasWidth/2 + size/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            svg.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", meanColors["normal"])
                                 .attr("opacity", "0.25")
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
                            .attr("x1", canvasWidth/2 + size/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + size/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "DOM");

    var x = canvasWidth/2 + size/2;
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
            .attr("x1", canvasWidth/2 + size/2 + significanceTestScaleOffset)
            .attr("y1", yMin)
            .attr("x2", canvasWidth/2 + size/2 + significanceTestScaleOffset)
            .attr("y2", yMax)
            .attr("stroke", meanColors["normal"])
            .attr("id", "mainScale")
            .attr("class", "significanceTestScale");            
    
    var x = canvasWidth/2 + size/2 + significanceTestScaleOffset;
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
    
    console.log("length: " + cx.length);
    
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



function getSelectedVariables()
{
    var means = document.getElementsByClassName("means");
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();    
    
    //add the dependent variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(variableType[currentVariableSelection[i]] != false)
        {
            variableList["dependent"].push(currentVariableSelection[i]);
        }
        else
        {
            variableList["independent"].push(currentVariableSelection[i]);
        }
    }    
    
    
    //add the levels of the independent variable
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {
            variableList["independent-levels"].push(means[i].getAttribute("id"));
        }
    }   
    
    return variableList; 
}
  
function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    
    switch(document.getElementsByClassName("completeLines").length)
    {
        case 1:
                //T-test
                {
                    //check assumptions
                    console.log("checking assumptions for t-test\n");
                    
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
                    //check assumptions
                    console.log("checking assumptions for ANOVA\n");
                    
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
                    // for(var i=0; i<variableList["dependent"].length; i++)
//                     {
//                         performNormalityTest(variableList["dependent"][i]);
//                     }
//                     var option = "parametric";
//                     var levels = variables[variableList["independent"][0]]["dataset"].unique();
//                     
//                     if(option == "parametric")
//                     {                                                    
//                         console.log(variables[variableList["dependent"][0]][levels[0]] + ",\n" + variables[variableList["dependent"][0]][levels[1]])
//                         performTTest(variables[variableList["dependent"][0]][levels[0]], variables[variableList["dependent"][0]][levels[1]]);                        
//                     }
                    
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
                  
                  console.log("levene's test:\n p-value =" + output.p);
                  
                  if(output.p < 0.05)
                  {
                    alert("check the assumptions dumbhead. variances are significantly different from each other!");
                  }
        
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

function performNormalityTest(variable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performShapiroWilkTest", {
                    variableName: variable,                    
                    dataset: dataset                    
                  }, function(output) {                                                   
                  
                  console.log("normality test:\n p-value =" + output.p + " (" + variable + ")");
        
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

//dataset = "", columnNameX = "", columnNameY = "", paired = "FALSE", alternative = "two.sided", alpha = 0.95)
function performTTest(group1, group2)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performTTest", {
                    dataset: dataset,
                    group1: group1,
                    group2: group2                   
                  }, function(output) {                                                   
                  
                  console.log("t-test: \n p-value =" + output.p + " (" + group1 + ", " + group2 + ")");
                  testResults["t"] = output.t;
                  testResults["p"] = output.p;
                  testResults["grandMean"] = output.mean;
                  testResults["method"] = output.method;
                  testResults["df"] = output.DOF;
                  
                  console.log(testResults["t"] + "; " + group1.length);
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
    var variableList = [];
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {
            variableList.push(means[i].getAttribute("id"));
        }
    }   
    
    return sort(variableList); //we have variables, now we need to sort them into independent and dependent variables
}

          
function sort(variableList)
{
    var newVariableList = new Object();
    
    newVariableList["dependent"] = new Array();
    newVariableList["independent"] = new Array();

    
    for(var i=0; i<variableList.length; i++)
    {
        if(variableType[variableList[i]] == false)
        {
            newVariableList["independent"].push(variableList[i]);
        }
        else
        {
            newVariableList["dependent"].push(variableList[i]);
        }
    }
    
    return newVariableList;
}
  
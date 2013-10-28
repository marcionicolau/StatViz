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
                  
                  
                //drawing stuff
                removeElementsByClass("completeLines");
                // var means = document.getElementsByClassName("means");
//                 
//                 var canvas = d3.select("#svgCanvas");
//                   
//                 for(var i=0; i<means.length; i++)
//                 {
//                     if(means[i].getAttribute("fill") == meanColors["click"])
//                     {
//                           canvas.append("line")
//                                     .attr("x1", means[i].getAttribute("cx"))
//                                     .attr("y1", means[i].getAttribute("cy"))
//                                     .attr("x2", canvasWidth/2 + size/2)
//                                     .attr("y2", means[i].getAttribute("cy"))
//                                     .attr("stroke", meanColors["normal"])
//                                     .attr("stroke-dasharray", "5,5")
//                                     .attr("id", "referenceLine" + means[i].getAttribute("id"))
//                                     .attr("class", "significance test");
//                     }
//                 }
//                 
//                 //arrow

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
                                 .attr("stroke", "black")
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

    var x = canvasWidth/2 + size;
    var y = cyMin;			 
    var head = svg.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "DOM");

    svg.append("line")
       .attr("x1", canvasWidth/2 + size/2 + 5)
       .attr("y1", cyMin - 45)
       .attr("x2", canvasWidth/2 + size/2 + 5)
       .attr("y2", cyMin + 45)
       .attr("stroke", "blue")
       .attr("stroke-width", "3px")
       .attr("opacity", "0.25")
       .attr("class", "CI")
       .attr("id", "dom");
    svg.append("line")
       .attr("x1", canvasWidth/2 + size/2)
       .attr("y1", cyMin - 45)
       .attr("x2", canvasWidth/2 + size/2 + 10)
       .attr("y2", cyMin - 45)
       .attr("stroke", "blue")
       .attr("stroke-width", "3px")
       .attr("opacity", "0.25")
       .attr("class", "CI")
       .attr("id", "dom");
    svg.append("line")
       .attr("x1", canvasWidth/2 + size/2)
       .attr("y1", cyMin + 45)
       .attr("x2", canvasWidth/2 + size/2 + 10)
       .attr("y2", cyMin + 45)
       .attr("stroke", "blue")
       .attr("stroke-width", "3px")
       .attr("opacity", "0.25")
       .attr("class", "CI")
       .attr("id", "dom");		

    var scale = svg.append("line")
                   .attr("x1", canvasWidth/2 + size/2 + 25)
                   .attr("y1", cyMin - 25)
                   .attr("x2", canvasWidth/2 + size/2 + 25)
                   .attr("y2", cyMax + 25)
                   .attr("class", "DOM")
                   .attr("stroke", "black");

    var scaleGrooves = [];

    for(var i=0; i<4; i++)				
    {
        scaleGrooves[i] = svg.append("line")
                             .attr("x1", canvasWidth/2 + size/2 + 30)
                             .attr("y1", cyMax + i*((cyMin - cyMax)/3))
                             .attr("x2", canvasWidth/2 + size/2 + 20)
                             .attr("y2", cyMax + i*((cyMin - cyMax)/3))
                             .attr("class", "DOM")
                             .attr("stroke", "black");
        svg.append("text")
           .attr("x", canvasWidth/2 + size/2 + 35)
           .attr("y", cyMax + i*((cyMin - cyMax)/3) + 2)
           .text(3*i)
           .attr("class", "DOM");
    }
    
    svg.append("text")
        .attr("x", canvasWidth/2 + size/2 + 50)
        .attr("y", (cyMin + cyMax)/2)
        .attr("fill", "blue")
        .attr("font-size", "18px")
        .attr("class", "DOM")
        .text("d = 0.32");
        
    svg.append("circle")
        .attr("cx", canvasWidth/2 + size/2 + 125)
        .attr("cy", (cyMin + cyMax)/2 - 3)
        .attr("r", "10px")
        .attr("fill", "lightgrey")
        .attr("stroke", "black")
        .attr("id", "dHoverCircle")
        .attr("class", "help");
    
    svg.append("text")
        .attr("x", canvasWidth/2 + size/2 + 122)
        .attr("y", (cyMin + cyMax)/2 + 1)
        .attr("fill", "black")
        .attr("font-size", "14px")
        .text("?")
        .attr("id", "dHoverText")
        .attr("class", "help");
    
    svg.append("text")
        .attr("x", canvasWidth/2 + size/2 - 25) 
        .attr("y", cyMax + 50)
        .attr("fill", "blue")
        .attr("font-size", "24px")
        .attr("class", "DOM")
        .text("Unpaired 2-tailed t-test was used (t(24) = 3.14)");
    
    svg.append("text")
        .attr("x", canvasWidth/2 + size/2 + 25) 
        .attr("y", cyMax + 75)
        .attr("fill", "blue")
        .attr("font-size", "24px")
        .attr("class", "DOM")
        .text("p = 0.0134 (< 0.05)");   
        
     svg.append("circle")
        .attr("cx", canvasWidth/2 + size/2 + 165)
        .attr("cy", cyMax + 70)
        .attr("r", "10px")
        .attr("fill", "lightgrey")
        .attr("stroke", "black")
        .attr("id", "pHoverCircle")
        .attr("class", "help");
    
    svg.append("text")
        .attr("x", canvasWidth/2 + size/2 + 162)
        .attr("y", cyMax + 75)
        .attr("fill", "black")
        .attr("font-size", "14px")
        .text("?")
        .attr("id", "pHoverText")
        .attr("class", "help");
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
  
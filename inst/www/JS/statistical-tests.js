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
                var means = document.getElementsByClassName("means");
                
                var canvas = d3.select("#svgCanvas");
                  
                for(var i=0; i<means.length; i++)
                {
                    if(means[i].getAttribute("fill") == meanColors["click"])
                    {
                          canvas.append("line")
                                    .attr("x1", means[i].getAttribute("cx"))
                                    .attr("y1", means[i].getAttribute("cy"))
                                    .attr("x2", canvasSize/2 + size/2)
                                    .attr("y2", means[i].getAttribute("cy"))
                                    .attr("stroke", meanColors["normal"]);
                    }
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
  
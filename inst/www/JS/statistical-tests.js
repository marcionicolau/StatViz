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
                    var levels = variables[variableList["independent"][0]].unique();
                    
                    if(option == "parametric")
                    {
                        for(var i=0; i<levels.length; i++)
                        {                            
                            performTTest(variables[variableList["dependent"][0]][levels[i]]);
                        }
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
  
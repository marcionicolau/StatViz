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
                  
                  console.log("test statistic: " + output.testStatistic);
        
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
  
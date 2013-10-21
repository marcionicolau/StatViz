function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    
    switch(document.getElementsByClassName("completeLines").length)
    {
        case 1:
                //T-test
                {
                    //check assumptions
                    console.log("checking assumptions for t-test");
                    
                    //homoscedasticity
                    performHomoscedasticityTest(getSelectedVariables());
                    
                    
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

function performHomoscedasticityTest(dataset, variableName)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
//                     dependentVariable: ,
//                     independentVariable: ,
                    dataset: dataset
                    
                  }, function(output) {                                 
        
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
    
    console.log("variables selected for statistical test = [" + variableList + "]");
    
    return varialbeList;
}
            
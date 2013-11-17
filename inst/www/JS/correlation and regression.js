// Correlation & Regression
function getCorrelationCoefficient(variableA, variableB, method)
{
    var req = opencpu.r_fun_json("getCorrelationCoefficient", {
                    distributionX: variables[variableA]["dataset"],                    
                    distributionY: variables[variableB]["dataset"],
                    method: method
                  }, function(output) {                                                   
                
                if(method == "pearson")
                {
                    console.log("\t\t\t Pearson's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
                    console.log("\t\t\t\t t = " + output.statistic);
                    console.log("\t\t\t\t p = " + output.p);
                    console.log("\t\t\t\t method used = " + output.method);
                    console.log("\t\t\t\t DF = " + output.df);
                    console.log("\t\t\t\t r = " + output.cor);
                    console.log("\t\t\t\t CI = [" + output.CI_min + ", " + output.CI_max + "]");

                    testResults["df"] = output.df;
                    testResults["statistic"] = "t(" + output.df + ") = " + output.statistic;
                    testResults["p"] = output.p;                  
                    testResults["method"] = output.method; 
                    testResults["effect-size"] = output.cor;
                    testResults["CI"] = [output.CI_min, output.CI_max];
                    
                    displayCorrelationResults();

                    if((output.cor < -0.5) || (output.cor > 0.5))
                    {                
                        alertPossibleRegressionModel();
                    }
                    
                }
                else if(method == "kendall")
                {
                    console.log("\t\t\t Kendall's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
                    console.log("\t\t\t\t z = " + output.statistic);
                    console.log("\t\t\t\t p = " + output.p);
                    console.log("\t\t\t\t method used = " + output.method);
                    console.log("\t\t\t\t Tau = " + output.cor);

                    testResults["statistic"] = "z = " + output.statistic;
                    testResults["p"] = output.p;                  
                    testResults["method"] = output.method; 
                    testResults["effect-size"] = output.cor;
               
                    displayCorrelationResults();

                    if((output.cor < -0.5) || (output.cor > 0.5))
                    {                
                        alertPossibleRegressionModel();
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

function getBiserialCorrelationCoefficient(continuousVariable, binaryVariable)
{
    var req = opencpu.r_fun_json("getBiserialCorrelationCoefficient", {
                    continuousVariable: variables[continuousVariable]["dataset"],
                    binaryVariable: variables[binaryVariable]["dataset"]
                  }, function(output) {                                                   
              
                console.log("\t\t Biserial Correlation-coefficient for (" + continuousVariable + " , " + binaryVariable + ")");                
                console.log("\t\t\t method used = " + "Biserial Correlation-coefficient");
                console.log("\t\t\t r = " + output.cor);

                testResults["method"] = "Biserial Correlation-coefficient";
                testResults["effect-size"] = output.cor;               
                
                displayCorrelationResults();

                if((output.cor < -0.5) || (output.cor > 0.5))
                {                
                    alertPossibleRegressionModel();
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

function getLinearModelCoefficients(causalVariable, predictorVariable)
{
    var req = opencpu.r_fun_json("getLinearModelCoefficients", {
                    causal: variables[causalVariable]["dataset"],
                    predictor: variables[predictorVariable]["dataset"]
                  }, function(output) {                                                   
                  
                console.log("X = [" + output.xIntercept + "]");
                console.log("Y= [" + output.yIntercept + "]");
                
                drawRegressionLine(output.xIntercept, output.yIntercept);
                
                testResults["effect-size"] = output.rSquared;
                testResults["method"] = "Linear Regression Model";
                testResults["equation"] = causalVariable + " = " + output.yIntercept + " x " + predictorVariable + " + " + output.xIntercept;
                testResults["intercept"] = output.xIntercept;
                testResults["slope"] = output.yIntercept;
                
                displaySimpleRegressionResults();
        
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

function performMultipleRegression(causalVariable, predictorVariables)
{
    var req = opencpu.r_fun_json("performMultipleRegression", {
                    causalVariable: causalVariable,
                    predictorVariable: predictorVariables,
                    dataset: dataset                
                  }, function(output) {                                                   
                  
                console.log("Performing Multiple Regression for " + causalVariable + " ~ [" + predictorVariables + "]");
                console.log("Intercept = " + output.intercept + ", coefficients = " + output.coefficients);
                
                testResults["effect-size"] = output.rSquared;
                testResults["method"] = "Multiple Regression";
                testResults["equation"] = causalVariable + " = ";
                
                for(var i=0; i<predictorVariables.length; i++)
                {
                    testResults["equation"] = testResults["equation"] + output.coefficients[i] + " x " + predictorVariables[i] + "  + ";
                }
                testResults["equation"] = testResults["equation"] + output.intercept;
                
                testResults["intercept"] = output.intercept;
                
                displayMultipleRegressionResults();
        
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
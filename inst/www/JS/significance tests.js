//Significance Tests

function performTTest(groupA, groupB, varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performTTest", {
                    groupA: groupA,
                    groupB: groupB,
                    variance: varianceEqual,
                    paired: paired
                  }, function(output) {                                                   
                  
                  console.log("\t\t " + output.method);
                  console.log("\t\t\t DOF = " + output.DOF);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t t = " + output.t);
                  
                  testResults["df"] = output.DOF;
                  testResults["statistic"] = "t(" + testResults["df"] +") = " + output.t;
                  testResults["p"] = output.p; 
                  testResults["method"] = output.method;
                  
                //drawing stuff
                removeElementsByClassName("completeLines");
                
                displaySignificanceTestResults();
        
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

function performMannWhitneyTest(groupA, groupB)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performMannWhitneyTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  console.log("\t\t Mann-Whitney U test");
                  console.log("\t\t\t U = " + output.U);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t r = " + output.r);
                  
                  testResults["statistic"] = "U = " + output.U;
                  testResults["p"] = output.p;                  
                  testResults["effect-size"] = "r = " + output.r;
                  testResults["method"] = "Mann-Whitney U test";
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();              
        
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

function performWilcoxonTest(groupA, groupB)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performWilcoxonTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  console.log("\t\t Wilcoxon Signed-rank Test");
                  console.log("\t\t\t V = " + output.V);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t r = " + output.r);
                  
                  testResults["statistic"] = "V = " + output.V;
                  testResults["p"] = output.p;                  
                  testResults["effect-size"] = "r = " + output.r;
                  testResults["method"] = "Wilcoxon Signed-rank test";
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();             
        
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
                  
                  console.log("\t\t One-way ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used = One-way ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.DOF);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.DOF;
                  testResults["statistic"] = "F(" + testResults["df"] + ") = " + output.F;
                  testResults["p"] = output.p;   
                  testResults["method"] = "ANOVA"; //todo
                  testResults["effect-size"] = "η^2 = " + output.etaSquared;
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();               
        
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



function performTwoWayANOVA(dependentVariable, independentVariableA, independentVariableB)
{
    // (dataset, dependentVariable, independentVariableA, independentVariableB)
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performTwoWayANOVA", {
                    dataset: dataset,
                    dependentVariable: dependentVariable,
                    independentVariableA: independentVariableA,
                    independentVariableB: independentVariableB
                  }, function(output) {                                                   
                  
                  console.log("\t\t Two-way ANOVA for (" + dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB + " " + independentVariableA + "*" + independentVariableB +")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t method used = Two-way ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.numDF + "/" + output.denomDF);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.numDF + "/" + output.denomDF;
                  testResults["statistic"] = "F(" + testResults["df"] + ") = " + output.F;   
                  testResults["method"] = "Two-way ANOVA"; //todo
                  testResults["effect-size"] = "η^2 = " + output.etaSquared;
                           
                  findEffect(dependentVariable, [independentVariableA, independentVariableB]);
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();               
        
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

function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var req = opencpu.r_fun_json("performOneWayRepeatedMeasuresANOVA", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    participantVariable: participants,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                  console.log("\t\t Repeated-measures ANOVA for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t method used = Repeated-measures ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.numDF + "/" + output.denomDF);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.numDF + "/" + output.denomDF;
                  testResults["statistic"] = "F(" + testResults["df"] + ") = " + output.F;   
                  testResults["method"] = "Repeated Measures ANOVA ANOVA"; //todo
                  testResults["effect-size"] = "η^2 = " + output.etaSquared;
                  testResults["p"] = output.p;
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();               
        
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

function performFriedmanTest(dependentVariable, independentVariable)
{
    console.log(dependentVariable);
    console.log(independentVariable);
    var req = opencpu.r_fun_json("performFriedmanTest", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    participantVariable: participants,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                  console.log("\t\t Friedman's Rank-sum Test for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                  console.log("\t\t\t ChiSquared = " + output.chiSquared);
                  console.log("\t\t\t method used = " + output.method); //todo
                  console.log("\t\t\t DF = " + output.df);
                  console.log("\t\t\t p = " + output.p);
                  
                  testResults["df"] = output.df;
                  testResults["statistic"] = "ChiSquared(" + testResults["df"] + ") = " + output.chiSquared;   
                  testResults["method"] = output.method; 
                  testResults["p"] = output.p;
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();               
        
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

function findEffect(dependentVariable, independentVariables)
{
    var req = opencpu.r_fun_json("findEffect", {
                    dependentVariable: dependentVariable,
                    independentVariables: independentVariables,                    
                    dataset: dataset
                  }, function(output) {                                                   
                var variableList = getSelectedVariables();
                
                var levelsA = variables[variableList["independent"][0]]["dataset"].unique().sort();
                var levelsB = variables[variableList["independent"][1]]["dataset"].unique().sort();

                for(var i=0; i<levelsB.length; i++)
                {
                    for(var j=0; j<levelsA.length; j++)
                    {
                        console.log(levelsA[j] + ":" + levelsB[i] + " = " + output.fit[i*levelsA.length + j]);
                    }
                }
                interactions = output.fit;
                
                drawInteractionEffectButton();
                //drawing stuff
//                 removeElementsByClassName("completeLines");           
// 
//                 displaySignificanceTestResults();               
        
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




function performWelchANOVA(dependentVariable, independentVariable)
{
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performWelchANOVA", {
                    dependentVariable: dependentVariableData,
                    independentVariable: independentVariableData                   
                  }, function(output) {                                                   
                  
                  console.log("\t\t Welch's ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used = Welch's ANOVA");
                  console.log("\t\t\t DF = (" + output.numeratorDF + ", " + output.denominatorDF +")");
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.numeratorDF + "/" + output.denominatorDF;
                  testResults["statistic"] = "F(" + testResults["df"] + ") = " + output.F;
                  testResults["p"] = output.p;
                  testResults["method"] = "Welch's ANOVA"; 
                  testResults["effect-size"] = "η^2 = " + output.etaSquared;
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines"); 
                
                displaySignificanceTestResults();
        
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

function performKruskalWallisTest(dependentVariable, independentVariable)
{
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performKruskalWallisTest", {
                    dependentVariable: dependentVariableData,
                    independentVariable: independentVariableData                   
                  }, function(output) {                                                   
                  
                  console.log("\t\t Kruskal-Wallis test for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t Chi-squared = " + output.ChiSquared);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used = Kruskal-Wallis Test ANOVA");
                  console.log("\t\t\t DF = " + output.DF);
                  
                  testResults["df"] = output.DF;
                  testResults["statistic"] = "𝝌^2(" + testResults["df"] + ") = " + output.ChiSquared;
                  testResults["p"] = output.p;                  
                  testResults["method"] = "Kruskal-Wallis Test"; 
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");   
                
                displaySignificanceTestResults();
        
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

function performTukeyHSDTest(dependentVariable, independentVariables)
{
//     (dependentVariable, independentVariables, dataset)   
    console.log("independent variables=[" + independentVariables + "]");
    var req = opencpu.r_fun_json("performKruskalWallisTest", {
                    dependentVariable: dependentVariable,
                    independentVariables: independentVariables,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                if(independentVariables.length == 1)
                {
                    console.log("TukeyHSD results: " + output.meIV1);
                }
                else if(independentVariables.length == 2)
                {
                    console.log("TukeyHSD results: " + output.meIV1 + "\n MEIV2: " + output.meIV2 + "\n IE: " + output.ie);
                }                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");   
                
//                 displaySignificanceTestResults();
        
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

// Effect sizes

function getDFromT(n)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getDFromT", {
                    t: testResults["t"],                   
                    n1: n,
                    n2: n
                  }, function(output) {                                                   
                  
                  console.log("Cohen's d: " + output.d);
                  
                  testResults["effect-size"] = "Cohen's d = " + output.d;
        
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
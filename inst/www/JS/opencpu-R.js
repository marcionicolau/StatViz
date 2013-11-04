function loadFile(filePath)
{
    //loads the file and returns the dataset and variable names
    var req = opencpu.r_fun_json("loadFile", {
                    filePath: filePath
                  }, function(output) {                   
    dataset = output.dataset;
         
    //render the variable names
    renderVariableNames(output.variableNames);
    variableNames = output.variableNames;
    
    //for each variable, get the data and the IQR
    for(var i=0; i<output.variableNames.length; i++)
    {
        variables[output.variableNames[i]] = new Object();
        MIN[output.variableNames[i]] = new Object();
        MAX[output.variableNames[i]] = new Object();
        IQR[output.variableNames[i]] = new Object();
        
        getData(dataset, output.variableNames[i]);                 
        getIQR(dataset, output.variableNames[i]);                    
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
    
function getVariables(dataset)
{   
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getVariableNames", {
                    dataset: dataset
                  }, function(output) {                   
    renderVariableNames(output.varNames);
    
    variableNames = output.varNames;
    
    
    for(var i=0; i<output.varNames.length; i++)
    {
        getData(dataset, output.varNames[i]);                 
        getIQR(dataset, output.varNames[i]);                    
    }
    
    console.log("\n\n*********************************************************************************\n\n") 
    
    }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });   
}

function getData(dataset, variableName, level)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getData", {
                    dataset: dataset,
                    columnName: variableName
                  }, function(output) {    
        
        if(level === undefined)
        {   
            level = "dataset";
        }         
        variables[variableName][level] = output.data;
        MIN[variableName][level] = Array.min(variables[variableName][level]);
        MAX[variableName][level] = Array.max(variables[variableName][level]);
        
        console.log("\n\tvariables[" + variableName + "][" + level + "] = " + variables[variableName][level]);
        console.log("\tMIN[" + variableName + "][" + level + "] = " + MIN[variableName][level]);
        console.log("\tMAX[" + variableName + "][" + level + "] = " + MAX[variableName][level]);   
        
        if(level == "dataset")
        {
            variableTypes[variableName] = "dependent";
            if(typeof(variables[variableName][level][0]) == "string")
            {           
                variableDataTypes[variableName] = "qualitative";
            }
            else if(typeof(variables[variableName][level][0]) == "number")
            {
                variableDataTypes[variableName] = "quantitative";           
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

function getIQR(dataset, variableName, level)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getIQR", {
                    dataset: dataset,
                    columnName: variableName
                  }, function(output) {                                 
        
    
        if(level === undefined)
        {   
            level = "dataset";
        }         
        IQR[variableName][level] = output.IQR;                                                                   
        
      
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

    
function splitDataByColumnName(dataset, columnName, value)
{   
    // Get variable names and their data type
    var req = opencpu.r_fun_json("splitDataByColumnName", {
                    dataset: dataset,
                    columnName: columnName,
                    value: value
                  }, function(output) {                  
                
       splitData[value] = output.data;  
       
       for(var i=0; i<variableNames.length; i++)
       {  
           getData(splitData[value], variableNames[i],value);                
           getIQR(splitData[value], variableNames[i],value);                
       }
                
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });   
}

function splitData1()
{
    var independentVariables = [];
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableTypes[variableNames[i]] == "independent")
        {
            independentVariables.push(variableNames[i]);
        }
    }
    
    for(var i=0; i<independentVariables.length; i++)
    {   
        //for every independent variable
        for(var j=0; j<variableNames.length; j++)
        {
            //for every variable
            var uniqueData = variables[independentVariables[i]]["dataset"].unique();
            for(var k=0; k<uniqueData.length; k++)
            {
                //for every level
                for(var m=0; m<variables[variableNames[j]]["dataset"].length; m++)
                {
                    if(variables[independentVariables[i]]["dataset"][m] == uniqueData[k])
                    {
                        if(variables[variableNames[j]][uniqueData[k]] == undefined)
                        {
                            variables[variableNames[j]][uniqueData[k]] = new Array();
                        }
                        
                        variables[variableNames[j]][uniqueData[k]].push(variables[variableNames[j]]["dataset"][m]);
                    }
                }
            }
            console.log(variableNames[j]);
            console.dir(variables);
        }
    }       
}

//Statistics

//Assumption-checking

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
                
                variableList = getSelectedVariables();
                
                if(variableList["independent-levels"].length > 2)
                {
                    if(output.p < 0.05)
                    {
                      d3.select("#homogeneity.crosses").attr("display", "inline");                  
                  
                      //Welch's ANOVA
                      performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                    
                        if(experimentalDesign == "between-groups")
                        {
                            performKruskalWallisTest(variableList["dependent"][0], variableList["independent"][0]);
                        }
                        else
                        {
                            console.log("Friedman's Test");
                        }                                        
                    }
                }
                else
                {  
                    if(output.p < 0.05)
                    {
                      d3.select("#homogeneity.crosses").attr("display", "inline");                 
                  
                      performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE");
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                    
                    
                        if(experimentalDesign == "between-groups")
                        {                        
                            performMannWhitneyTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }
                        else
                        {
                            performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }                                        
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

function performHomoscedasticityTestNormality(dependent, independent)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                  }, function(output) {                                 
                  
                console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                console.log("\t\t\t p = " + output.p);
                
                variableList = getSelectedVariables();
                console.log("number of levels: " + variableList["independent-levels"].length);
                
                if(variableList["independent-levels"].length > 2)
                {
                    if(output.p < 0.05)
                    {
                      d3.select("#homogeneity.crosses").attr("display", "inline");                  
                  
                      //Welch's ANOVA
                      performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                    
                        if(experimentalDesign == "between-groups")
                        {
                            performANOVA(variableList["dependent"][0], variableList["independent"][0]);
                        }
                        else
                        {
                            console.log("repeated-measures ANOVA");
                        }                                        
                    }
                }
                else
                {               
                    if(output.p < 0.05)
                    {
                      d3.select("#homogeneity.crosses").attr("display", "inline");                  
                  
                      performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE");
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                    
                        if(experimentalDesign == "between-groups")
                        {
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
                        }
                        else
                        {
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "FALSE");
                        }                                        
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

function performNormalityTest(dist, dependentVariable, level)
{
    // Get variable names and their data type
    
    
    var req = opencpu.r_fun_json("performShapiroWilkTest", {
                    distribution: dist                                                           
                  }, function(output) {                                                   
                  
                console.log("\t\t Shapiro-wilk test for (" + dependentVariable + "." + level + ")");
                console.log("\t\t\t p = " + output.p);
                  
                if(output.p < 0.05)
                {        
                    setDistribution(dependentVariable, level, false);
                }
                else
                {   
                    setDistribution(dependentVariable, level, true);
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

function findTransform(dist)
{
    // Get variable names and their data type
    
    
    var req = opencpu.r_fun_json("findTransform", {
                    distribution: dist
                  }, function(output) {                                                   
                  
                console.log("type=" + output.type);
                
                if(output.type == "none")
                {
                    var variableList = getSelectedVariables();
                    performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                }
                else
                {
                    console.log("Offer choice to the user");
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

//Significance Tests

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
                removeElementsByClassName("completeLines");           

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
                  
                  console.log("\t\t One-way ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used = One-wayANOVA"); //todo
                  console.log("\t\t\t DF = " + output.DOF);
                  
                  testResults["F"] = output.F;
                  testResults["p"] = output.p;                  
                  testResults["df"] = output.DOF;
                  testResults["method"] = "ANOVA"; //todo
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

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
                  console.log("\t\t\t method used= Welch's ANOVA");
                  console.log("\t\t\t DF = (" + output.numeratorDF + ", " + output.denominatorDF +")");
                  
                  testResults["F"] = output.F;
                  testResults["p"] = output.p;                  
                  testResults["numDF"] = output.numeratorDF;
                  testResults["denomDF"] = output.denominatorDF;
                  testResults["method"] = "Welch's ANOVA"; 
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");                          
        
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
                  console.log("\t\t\t Chi-squared = " + output.chiSquared);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used= Kruskal-Wallis Test ANOVA");
                  console.log("\t\t\t DF = " + output.DF);
                  
                  testResults["F"] = output.F;
                  testResults["p"] = output.p;                  
                  testResults["DF"] = output.DF;
                  testResults["method"] = "Kruskal-Wallis Test"; 
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");                          
        
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
                  
                  testResults["U"] = output.U;
                  testResults["p"] = output.p;                  
                  testResults["r"] = output.r;
                  
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

//                 ANOVA();                
        
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
                  
                  testResults["V"] = output.V;
                  testResults["p"] = output.p;                  
                  testResults["r"] = output.r;
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

//                 ANOVA();                
        
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
                  
                  testResults["t"] = output.t;
                  testResults["p"] = output.p;                  
                  testResults["df"] = output.DOF;
                  testResults["method"] = output.method;
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           
        
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

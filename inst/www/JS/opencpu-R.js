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
    
    console.log("variableNames=" + variableNames);
    
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
        
        if((variableName == variableNames[variableNames.length - 1]) && (level == "dataset"))
        {
            init();
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
                
                if(output.p < 0.05)
                {
                  d3.select("#" + assumptions[0] + ".crosses").attr("display", "inline");                  
                }
                else
                {
                    d3.select("#" + assumptions[0] + ".ticks").attr("display","inline");
                    
                    //normality
                    distributions[dependent] = {};
                    doNormalityTests();                    
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

function loadFile(filePath)
{
    //loads the file and returns the dataset and variable names
    var req = opencpu.r_fun_json("loadFile", {
                    filePath: filePath
                  }, function(output) {                   
    dataset = output.dataset;
     
    console.log("dataset: " + dataset + "\n");               
    console.log("variables in the dataset: [" + output.variableNames + "]\n");
    
    //render the variable names
    renderVariableNames(output.variableNames);
    varNames = output.variableNames;
    
    //for each variable, get the data and the IQR
    for(var i=0; i<output.variableNames.length; i++)
    {
        variables[output.variableNames[i]] = new Object();
        MIN[output.variableNames[i]] = new Object();
        MAX[output.variableNames[i]] = new Object();
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
    for(var i=0; i<output.varNames.length; i++)
    {
        getData(dataset, output.varNames[i]);                 
        getIQR(dataset, output.varNames[i]);                    
    }
    
    console.log("\n\n") }).fail(function(){
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
            variables[variableName]["entire"] = output.data;
            MIN[variableName]["entire"] = Array.min(variables[variableName]);
            MAX[variableName]["entire"] = Array.max(variables[variableName]);

            console.log("variables[" + variableName + "][entire] = " + variables[variableName]["entire"]);
            console.log("MIN[" + variableName + "][entire] = " + MIN[variableName]["entire"]);
            console.log("MAX[" + variableName + "][entire] = " + MAX[variableName]["entire"]);

        }
        else
        {                       
            variables[variableName][level] = output.data;
            
            
            console.log("variables[" + variableName + "][" + level + "] = " + variables[variableName][level]);
            console.log("MIN[" + variableName + "][" + level + "] = " + MIN[variableName][level]);
            console.log("MAX[" + variableName + "][" + level + "] = " + MAx[variableName][level]);            
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

function getIQR(dataset, variableName)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getIQR", {
                    dataset: dataset,
                    columnName: variableName
                  }, function(output) {                                 
    IQR[variableName] = output.IQR;                                                                   
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
       
       for(var i=0; i<varNames.length; i++)
       {  
           getData(splitData[value], varNames[i],value);                
       }
                
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });   
}

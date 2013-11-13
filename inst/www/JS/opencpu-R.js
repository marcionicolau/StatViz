//to load a file on local disk
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
        CI[output.variableNames[i]] = new Object();
        
        getData(dataset, output.variableNames[i]);                 
        getIQR(dataset, output.variableNames[i]);  
        getCI(dataset, output.variableNames[i]);
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

//to get the variable names    
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
        ticker++;
        
        console.log(ticker + ", " + getObjectLength(variableNames));
        if(ticker == getObjectLength(variableNames))
        {
            setVariableTypes();
            setVariableDataTypes();
            clearInterval(loadingDataAnimation);
            removeElementsByClassName("loadingAnimation");
            experimentalDesign = findExperimentalDesign();
            
            console.log(experimentalDesign);
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

function getCI(dataset, variableName, level)
{
    if(level == undefined)
        level = "dataset";
        
    var req = opencpu.r_fun_json("getCI", {
                    dataset: dataset,
                    variableName: variableName
                  }, function(output) {                    
        
        CI[variableName][level] = new Array();
        
        CI[variableName][level][0] = output.min;
        CI[variableName][level][1] = output.max;
                
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
}  

//Split data - R based   
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

function performHomoscedasticityTestNotNormal(dependent, independent)
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

function performHomoscedasticityTestNormal(dependent, independent)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                  }, function(output) {                                 
                  
                console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                console.log("\t\t\t p = " + output.p);
                
                variableList = sort(currentVariableSelection);
                
                if(variableList["independent"].length == 2)
                {
                    if(output.p < 0.05)
                    {        
                        setHomogeneityOfVariances(dependent, independent, false);
                    }
                    else
                    {   
                        setHomogeneityOfVariances(dependent, independent, true);
                    }
                }                
                
                else
                {
                
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
                                performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
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
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "FALSE");
                            }
                            else
                            {
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
                            }                                        
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

function findTransform(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    
    
    var req = opencpu.r_fun_json("findTransform", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                console.log("type=" + output.type);
                
                if(output.type == "none")
                {
                    var variableList = getSelectedVariables();
                    performHomoscedasticityTestNotNormal(variableList["dependent"][0], variableList["independent"][0]);
                    d3.select("#svgCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                }
                else
                {
                    console.log("type=" + output.type);
                    transformationType = output.type;
                    //offer choice
                    var canvas = d3.select("#svgCanvas");
                    
                    canvas.append("rect")
                            .attr("x", canvasWidth/2 + plotWidth/2 + buttonOffset)
                            .attr("y", canvasHeight/2 - plotHeight/2 + buttonOffset)
                            .attr("width", buttonWidth)
                            .attr("height", buttonHeight)
                            .attr("rx", "10")
                            .attr("ry", "10")
                            .attr("fill", "white")
                            .attr("stroke", "black")
                            .attr("id", "button")
                            .attr("class", "transformToNormal");
                    
                    canvas.append("text")
                            .attr("x", canvasWidth/2 + plotWidth/2 + buttonOffset + buttonWidth/2)
                            .attr("y", canvasHeight/2 - plotHeight/2 + buttonOffset + buttonHeight/2)
                            .attr("fill", "orange")
                            .attr("text-anchor", "middle")
                            .attr("font-size", "24px")
                            .text("transform all to normal distributions")
                            .attr("id", "text")
                            .attr("class", "transformToNormal");
                            
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

function applyTransform(dependentVariable, level, last)
{
    // Get variable names and their data type
    
    var req = opencpu.r_fun_json("applyTransform", {
                    distribution: variables[dependentVariable][level],
                    type: transformationType
                  }, function(output) {                                                   
                  
                variables[dependentVariable][level] = output.transformedData;
                MIN[dependentVariable][level] = Array.min(output.transformedData);
                MAX[dependentVariable][level] = Array.max(output.transformedData);
                IQR[dependentVariable][level] = findIQR(output.transformedData);
                CI[dependentVariable][level] = findCI(output.transformedData);
                
                if(last)
                {
                    console.dir(variables);
                    console.log("CI=");
                    console.dir(CI);
                    redrawBoxPlot();
                    
                    removeElementsByClassName("densityCurve");
                    var variableList = getSelectedVariables();
                    
                    for(var i=0; i<variableList["independent-levels"].length; i++)
                    {   
                        if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                        {
                            var mean = d3.select("#" + variableList["independent-levels"][i] + ".means");
                            var centerX = mean.attr("cx");   
                            makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;
                        }
                    }                 
                    
                    removeElementsByClassName("transformToNormal");
                    removeElementsByClassName("completeLines");
                    
                    var text = d3.select("#" + level + ".xAxisGrooveText");
                    text.attr("fill", boxColors["normal"]);
                    
                    d3.select("#normality.crosses").attr("display", "none");  
                    d3.select("#normality.ticks").attr("display", "inline");  
                    var variableList = sort(currentVariableSelection);                    
                    performHomoscedasticityTestNormal(dependentVariable, variableList["independent"][0]);
                    
                    d3.select("#svgCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
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


// Correlation & Regression
function getCorrelationCoefficient(variableA, variableB, method)
{
    var req = opencpu.r_fun_json("getCorrelationCoefficient", {
                    distributionX: variables[variableA]["dataset"],                    
                    distributionY: variables[variableB]["dataset"],
                    method: method
                  }, function(output) {                                                   
                  
                //(t = result$statistic[["t"]], df = result$parameter[["df"]], p = result$p.value, cor = result$estimate[["cor"]], method = result$method, CI_min = result$conf.int[1], CI_max = result$conf.int[2]);
                console.log("\t\t Correlation-coefficient for (" + variableA + " , " + variableB + ")");
                console.log("\t\t\t t = " + output.t);
                console.log("\t\t\t p = " + output.p);
                console.log("\t\t\t method used = " + output.method);
                console.log("\t\t\t DF = " + output.df);
                console.log("\t\t\t r = " + output.cor);
                console.log("\t\t\t CI = [" + output.CI_min + ", " + output.CI_max + "]");

                testResults["df"] = output.df;
                testResults["statistic"] = "t(" + output.df + ") = " + output.t;
                testResults["p"] = output.p;                  
                testResults["method"] = output.method; 
                testResults["effect-size"] = output.cor;
                testResults["CI"] = [output.CI_min, output.CI_max];

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
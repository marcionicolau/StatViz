function findCorrelationCoefficient(variableA, variableB, noDisplay)
{
    console.log("\nCORRELATION");
    console.log("\t\ttypeOf(" + variableA + ")=" + variableDataTypes[variableA] + ", typeOf(" + variableB + ")=" + variableDataTypes[variableB]);
    
    
    if((variableDataTypes[variableA] == "binary") && (variableDataTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("\t\t\tCramer's V");
        return -1;
    }
    else if(((variableDataTypes[variableA] == "binary") || (variableDataTypes[variableB] == "binary")) && ((variableDataTypes[variableA] != "binary") || (variableDataTypes[variableB] != "binary")))
    {
        //one is binary
        
        
        console.log("in");
        if(variableDataTypes[variableA] == "binary")
        {
            console.log(isNaN(variables[variableA]["dataset"][0]));
//             if(!isNaN(variables[variableA]["dataset"][0]))
//             {
                console.log("\t\t\tBiserial Correlation Coefficient");
                getBiserialCorrelationCoefficient(variableB, variableA, noDisplay);
            // }
//             else
//             {   
//                 console.log("\t\t\tDoing nothing");
//                 return -1;
//             }
        }
        else
        {
            // if(!isNaN(variables[variableB]["dataset"][0]))
//             {
                console.log("\t\t\tBiserial Correlation Coefficient");
                getBiserialCorrelationCoefficient(variableA, variableB, noDisplay);
            // }
//             else
//             {
//                 console.log("\t\t\tDoing nothing");
//                 return -1;
//             }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableDataTypes[variableA] == "ordinal") || (variableDataTypes[variableB] == "ordinal")) && ((variableDataTypes[variableA] != "nominal") && (variableDataTypes[variableB] != "nominal")))
        {
            console.log("\t\t\tKendall's Tau");            
            getCorrelationCoefficient(variableA, variableB, "kendall", noDisplay);
        }
        else if((variableDataTypes[variableA] == "nominal") || (variableDataTypes[variableB] == "nominal"))
        {
            //do nothing
            console.log("\t\t\tDoing nothing");
            return -1;
        }
        else
        {
            console.log("\t\t\tPearson's correlation");
            getCorrelationCoefficient(variableA, variableB, "pearson", noDisplay);
        }
    }
}

function testForEvilVariables()
{  
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = variableNames[i];
        var variableData = variables[variable]["dataset"];
        var uniqueVariableData = variableData.unique();

        if((variableDataTypes[variable] == "nominal") || (variableDataTypes[variable] == "ordinal"))
        {
            if(uniqueVariableData.length > 15)
            {
                console.log("making " + variable + " as an evil variable");
                setThisVariableEvil(variableNames[i]);
            }
        }
    }
}
        
function findCorrelationCoefficient(variableA, variableB, noDisplay)
{
    console.log("type of variable 1: " + variableDataTypes[variableA] + ", type of variable 2: " + variableDataTypes[variableB]);
    
    
    if((variableDataTypes[variableA] == "binary") && (variableDataTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("Cramer's V");
        return -1;
    }
    else if(((variableDataTypes[variableA] == "binary") || (variableDataTypes[variableB] == "binary")) && ((variableDataTypes[variableA] != "binary") || (variableDataTypes[variableB] != "binary")))
    {
        //one is binary
        
        
        
        if(variableDataTypes[variableA] == "binary")
        {
            if(!isNaN(variables[variableA]["dataset"][0]))
            {
                console.log("Biserial Correlation Coefficient");
                getBiserialCorrelationCoefficient(variableB, variableA);
            }
            else
            {   
                console.log("Doing nothing");
                return -1;
            }
        }
        else
        {
            if(!isNaN(variables[variableB]["dataset"][0]))
            {
                console.log("Biserial Correlation Coefficient");
                getBiserialCorrelationCoefficient(variableA, variableB);
            }
            else
            {
                console.log("Doing nothing");
                return -1;
            }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableDataTypes[variableA] == "ordinal") || (variableDataTypes[variableB] == "ordinal")) && ((variableDataTypes[variableA] != "nominal") && (variableDataTypes[variableB] != "nominal")))
        {
            console.log("Kendall's Tau");            
            getCorrelationCoefficient(variableA, variableB, "kendall", noDisplay);
        }
        else if((variableDataTypes[variableA] == "nominal") || (variableDataTypes[variableB] == "nominal"))
        {
            //do nothing
            console.log("doing nothing");
            return -1;
        }
        else
        {
            console.log("Pearson's correlation");
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
        
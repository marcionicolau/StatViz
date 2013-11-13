function findCorrelationCoefficient()
{
    if((variableDataTypes[currentVariableSelection[0]] == "binary") && (variableDataTypes[currentVariableSelection[1]] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("Cramer's V");
    }
    else if((variableDataTypes[currentVariableSelection[0]] == "binary") || (variableDataTypes[currentVariableSelection[1]] == "binary"))
    {
        //one is binary
        
        console.log("Biserial Correlation Coefficient");
    }
    else
    {
        //both are not binary
        
        if((variableDataTypes[currentVariableSelection[0]] == "ordinal") || (variableDataTypes[currentVariableSelection[1]] == "ordinal"))
        {
            console.log("Kendall's Tau");            
            getCorrelationCoefficient(currentVariableSelection[0], currentVariableSelection[1], "kendall");
        }
        else if((variableDataTypes[currentVariableSelection[0]] == "nominal") || (variableDataTypes[currentVariableSelection[1]] == "nominal"))
        {
            //do nothing
            console.log("doing nothing");
        }
        else
        {
            console.log("Pearson's correlation");
            getCorrelationCoefficient(currentVariableSelection[0], currentVariableSelection[1], "pearson");
        }
    }
}
        
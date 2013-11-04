performWelchANOVA <- function(dependentVariable, independentVariable)
{
    dependentVariable <- c(dependentVariable);
    independentVariable <- c(independentVariable);
    
    result = oneway.test(dependentVariable ~ independentVariable);
    
    list(p = result$p.value, F = result$statistic[["F"]], numeratorDF = result$parameter[["num df"]], denominatorDF = result$parameter[["denom df"]]);
}   
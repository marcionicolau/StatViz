performOneWayRepeatedMeasuresANOVA <- function(dependentVariable, independentVariable, participants, dataset)
{   
    install.packages("ez");
    library(ez);
        
    table <- as.data.frame(dataset);
    
    result <- eval(parse(text = paste("ezANOVA(table,",dependentVariable,",",participants,",between=",independentVariable,")"));
    result <- result$ANOVA;
    
    list(numDf = result$DFn, denomDF = result$DFd, F = result$F, p = result$p, etaSquared = result$ges);
    
}
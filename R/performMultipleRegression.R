performMultipleRegression <- function(causalVariable, predictorVariables, dataset)
{
    table <- as.data.frame(dataset);
    
    pretext = paste("lm(",causalVariable,"~",sep="");
    
    for(i in 1:length(predictorVariables))
    {
        if(i != length(predictorVariables))
        {
            pretext = paste(pretext,predictorVariables[i]," + ",sep="");
        }
        else
        {
            pretext = paste(pretext,predictorVariables[i],sep="");
        }
    }
    
    pretext = paste(pretext,", data=table)",sep="");
    
    model <- eval(parse(text = pretext));
    
    result <- summary(model);
}
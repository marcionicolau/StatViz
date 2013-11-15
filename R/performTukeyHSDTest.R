performTukeyHSDTest <- function(dependentVariable, independentVariables, dataset)
{
    table <- as.data.frame(dataset);
    
    
        model <- eval(parse(text = paste("aov(",dependentVariable," ~ ",independentVariables[1],", data=table)",sep="")));
        
        result <- TukeyHSD(model);
        
        mainEffect = eval(parse(text = paste("result[[\"",independentVariables[1],"\"]]",sep="")));
        
        mainEffect = as.data.frame(mainEffect);
        
        list(difference = mainEffect[["diff"]], lower = mainEffect[["lwr"]], upper = mainEffect[["upr"]], adjustedP = mainEffect[["p adj"]]);
    
    
}
performTukeyHSDTest <- function(dependentVariable, independentVariables, dataset)
{
    table <- as.data.frame(dataset);
    
    if(length(independentVariables) == 1)
    {
        model <- eval(parse(text = paste("aov(",dependentVariable," ~ ",independentVariables[1],", data=table)",sep="")));
        
        result <- TukeyHSD(model);
        
        mainEffect = eval(parse(text = paste("result[[\"",independentVariables[1],"\"]]",sep="")));
        
        mainEffect = as.data.frame(mainEffect);
        
        list(difference = mainEffect[["diff"]], lower = mainEffect[["lwr"]], upper = mainEffect[["upr"]], adjustedP = mainEffect[["p adj"]]);
    }
    if(length(independentVariables) == 2)
    {
        model <- eval(parse(text = paste("aov(",dependentVariable," ~ ",independentVariables[1]," + ",independentVariables[2]," + ", independentVariables[1],"*",independentVariables[2],",data=table)",sep="")));
        
        result <- TukeyHSD(model);
        list(meIV1 = eval(parse(text = paste("result[[\"",independentVariables[1],"\"]]",sep=""))), meIV2 = eval(parse(text = paste("result[[\"",independentVariables[2],"\"]]",sep=""))), ie = eval(parse(text = paste("result[[\"",independentVariables[1],":",independentVariables[2],"\"]]",sep=""))));
    }
}
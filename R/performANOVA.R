performANOVA <- function(dependentVariable = "", independentVariable = "", dataset = "")
{       
    table <- as.data.frame(dataset);
    
    model <- eval(parse(text = paste("lm(formula = ",dependentVariable," ~ ",independentVariable", data = table)");
  
    result <- anova(model);
  
    list(F = result[["F value"]][1], DOF = result[["Df"]][1], p = result[["Pr(>F)"]][1], data = paste(dependentVariable, independentVariable));
}

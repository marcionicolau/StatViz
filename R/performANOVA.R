performANOVA <- function(dependentVariable = "", independentVariable = "", dataset = "")
{       
  model <- lm(depV ~ indepV, dataset);
  
  result <- anova(fit);
  
  list(F = result[["F value"]][1], DOF = result[["Df"]][1], p = result[["Pr(>F)"]][1], data = paste(dependentVariable, independentVariable));
}

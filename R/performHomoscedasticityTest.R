performHomoscedasticityTest <- function(dependentVariable = "", independentVariable = "", dataset = "", type = "levene")
{
  // p < 0.05 => there is a significant difference between the variances!
  
  install.packages("lawstat");
  
  library(lawstat);
  
  table <- as.data.frame(dataset) 
    
  if(type == "levene")
  {
    method = "mean"; 
  }
  else
  {
    method = "median";
  }
  
  result <- eval(parse(text = paste("levene.test(table$",dependentVariable,", table$", independentVariable, ",location = method)")));
  
  list(testStatistic = result$statistic[["Test Statistic"]], p = result$p.value, method = result$method, data = toString(dataset));
}

performShapiroWilkTest <- function(variableName, dataset)
{ 
  table <- as.data.frame(dataset) 
  
  result <- eval(parse(text = paste("shapiro.test(table$",dependentVariable,")")));
  
  list(testStatistic = result$statistic[["Test Statistic"]], p = result$p.value, method = result$method, data = toString(dataset));
}

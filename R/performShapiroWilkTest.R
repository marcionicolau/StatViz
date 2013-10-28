performShapiroWilkTest <- function(variableName, dataset)
{  
  table <- as.data.frame(dataset) 
  
  result <- eval(parse(text = paste("shapiro.test(table$",variableName,")")));
  
  list(testStatistic = result$statistic[["W"]], p = result$p.value, method = result$method, data = toString(dataset));
}

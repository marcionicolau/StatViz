performShapiroWilkTest <- function(variableName, dataset)
{  
  // p < 0.05 => distribution is NOT normal
  table <- as.data.frame(dataset) 
  
  result <- eval(parse(text = paste("shapiro.test(table$",variableName,")")));
  
  list(testStatistic = result$statistic[["W"]], p = result$p.value, method = result$method, data = toString(dataset));
}

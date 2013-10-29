performShapiroWilkTest <- function(distribution)
{  
  dist <- as.data.frame(distribution) 
  
  result <- eval(parse(text = paste("shapiro.test(dist)")));
  
  list(testStatistic = result$statistic[["W"]], p = result$p.value, method = result$method);
}

performFriedmanTest <- function(dependentVariable, independentVariable)
{
  url = "http://ww2.coastal.edu/kingw/statistics/R-tutorials/text/groceries.txt";
  
  groceries = read.table(url, header=T);
  groceries2 <- stack(groceries);
  subject = rep(groceries$subject,4);
  
  groceries2[3] = subject;
  
  colnames(groceries2) = c("price","store","subject");
  
  result = friedman.test(price ~ store | subject, data = groceries2);
  
  list(ChiSquared = result$statistic[["Friedman chi-squared"]], DF = result$parameter[["df"]], p = result$p.value, data = print(groceries2));
}
  

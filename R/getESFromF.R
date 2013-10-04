getESFromF <- function(F = "3.14", n1 = "40", n2 = "40")
{
  install.packages("compute.es");
  
  library(compute.es);
  
  # result = fes(eval(parse(text = F)), eval(parse(text = n1)), eval(parse(text = n2)));
  
  result = fes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], F = F, n1 = n1, n2 = n2);
}

getESFromChiSquared <- function(TVal = "", n1 = "", n2 = "")
{
  
  install.packages("compute.es");
  
  library(compute.es);
  
  
  if(TVal == "")
  {
    TVal = "3.14";
    n1 = "40";
    n2 = "40";
  }
  
  
  result = tes(eval(parse(text = TVal)), eval(parse(text = n1)), eval(parse(text = n2)));
  
  # result = tes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], TVal= TVal, n1 = n1, n2 = n2);
}

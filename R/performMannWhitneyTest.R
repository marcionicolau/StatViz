performMannWhitneyTest <- function(dependentVariable = "", independentVariable = "", dataset = "")
{
  # Get distributions
  
  if(dataset == "")
  {   
    y1 = c(18.2, 20.1, 17.6, 16.8, 18.8, 19.7, 19.1);
    y2 = c(17.4, 18.7, 19.1, 16.4, 15.9, 18.4, 17.7);
    
    dependentVariable = c(y1, y2);
    
    independentVariable = rep(c('category 1', 'category 2'), each=7);
    
    dataset = data.frame(depV = dependentVariable, indepV = factor(independentVariable));
  }
  else
  {
    dataset = eval(parse(text = dataset));
    
    dependentVariable = eval(parse(text = paste(dataset,"$",dependentVariable)));
    independentVariable = eval(parse(text = paste(dataset,"$",independentVariable)));
  }  
    
  result <- wilcox.test(depV ~ indepV, dataset);
  
  list(W = result$statistic[["W"]], p = result$p.value);
}

performKruskalTest <- function(dependentVariable = "", independentVariable = "", dataset = "")
{
  table <- as.data.frame(dataset);
  
  result <- eval(parse(text = paste("kruskal.test(formula=",dependentVariable," ~ ", independentVariable,", table)",sep="")));  
  
  list(ChiSquared = result$statistic[["Kruskal-Wallis chi-squared"]], DOF = result$parameter[["df"]], p = result$p.value);
}

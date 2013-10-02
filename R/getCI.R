getCI <- function(dataset = "", columnName = "", alpha = "0.95")
{
  if(dataset == "")
  {   
    dataset = "beaver1";
    columnName = "time";
  }
  else if(columnName == "")
  {
    # Load the first column name by default
    columnName = names(eval(parse(text = dataset)))[1]; 
  }
        
  distribution = eval(parse(text = paste(dataset,"$",columnName)));
  
  
  # Find mean
  
  # TODO: use custom function
  
  mean = mean(distribution);
  
  
  # Find SD (sigma)
  
  sigma = sd(distribution)
  
  
  
  # Get number of samples (n)
  
  n = length(distribution)
  
  
  
  # Find CI
  
  error <- qnorm(0.975)*sigma/sqrt(n);
  
  list(min = mean - error, max = mean + error);

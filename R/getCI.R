getCI <- function(distribution, alpha = "0.95")
{        
  distribution = c(distribution);
  
  mean = mean(distribution);  
  sigma = sd(distribution);  
  n = length(distribution);
    
  alpha = eval(parse(text = alpha));
  z = 1 - (alpha/2);
  
  error <- qnorm(z)*sigma/sqrt(n);
  
  list(min = mean - error, max = mean + error);
}

performTTest <- function(dataset = "", group1 = "", group2 = "", paired = "FALSE", alternative = "two.sided", alpha = 0.95)
{
  table <- as.data.frame(dataset);  
  
  distributionX <- as.data.frame(group1);
  distributionY <- as.data.frame(group2);
        
  
  # Do T-test  
  result = t.test(x=distributionX, y=distributionY, alternative=alternative, paired=eval(parse(text = paired)), var.equal=TRUE, conf.level=eval(parse(text=alpha)));
  
  
  # Interpret T-test  
  list(p=result$p.value, 
  t=result$statistic[["t"]], 
  DOF=result$parameter[["df"]], 
  CI_mean=result$conf.int, 
  method=result$method, 
  dataset = dataset, 
  alpha = alpha
  mean = result$estimate);
}

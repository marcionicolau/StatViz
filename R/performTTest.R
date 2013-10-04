performTTest <- function(dataset = "", columnNameX = "", columnNameY = "", paired = "FALSE", tailed = "two.sided", alpha = "0.95")
{
  # Get distributions
  
  if(dataset == "")
  {   
    dataset = "beaver1";
    columnNameX = "time";
    columnNameY = "temp";
  }
  else if(columnNameX == "")
  {
    # Load the first column name by default
    columnNameX = names(eval(parse(text = dataset)))[1]; 
    columnNameY = names(eval(parse(text = dataset)))[2]; 
  }
        
  distributionX = eval(parse(text = paste(dataset,"$",columnNameX)));
  distributionY = eval(parse(text = paste(dataset,"$",columnNameY)));
  
  # Do T-test
  
  result = t.test(x=distributionX, y=distributionY, alternative=tailed, paired=eval(parse(text = paired)), var.equal=TRUE, conf.level=eval(parse(text = alpha)))
  
  
  # Interpret T-test
  
  list(p=result$p.value, t=result$statistic[["t"]], DOF=result$parameter[["df"]], CI_mean=result$conf.int, method=result$method, dataset = dataset, columnName1 = columnNameX, columnName2 = columnNameY);
}

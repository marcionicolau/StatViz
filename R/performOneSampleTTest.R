performOneSampleTTest <- function(distribution, trueMean = "0")
{
    distribution = c(distribution);
    
    result = t.test(distribution, mu = eval(parse(text = trueMean)));
    
    list(statistic = result$statistic[["t"]], df = result$parameter[["df"]], p = result$p.value, estimate = result$estimate[["mean of x"]], method = result$method);
}
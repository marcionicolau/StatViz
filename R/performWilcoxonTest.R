performWilcoxonTest <- function(groupA, groupB)
{   
    groupA <- c(groupA);    
    groupB <- c(groupB);
      
    result <- wilcox.test(groupA, groupB, paired = T);
  
    V = result$statistic[["V"]];
    p = result$p.value;
    
    install.packages("coin");
    
    library(coin);
    
    result <- wilcoxsign_test(groupA ~ groupB, distribution = "exact");
    
    Z = result@statistic@teststatistic[["groupA"]];
    
    r = Z/length(groupA);
    
    list(V = V, p = p, r = abs(r));
}

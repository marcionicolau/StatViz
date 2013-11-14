getBiserialCorrelationCoefficient <- function(continuousVariable, binaryVariable)
{
    require("ltm");
    
    c <- c(continuousVariable);
    b <- b(continuousVariable);
    
    list(cor = biserial.cor(c, b, use = "complete.obs"));  
}
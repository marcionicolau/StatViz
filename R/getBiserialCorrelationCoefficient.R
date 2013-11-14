getBiserialCorrelationCoefficient <- function(continuousVariable, binaryVariable)
{
    require("ltm");
    
    c <- c(continuousVariable);
    b <- c(continuousVariable);
    
    list(cor = biserial.cor(c, b, use = "complete.obs"));  
}
getCorrelationCoefficient <- function(distributionX, distributionY, method = "pearson") 
{
    X = c(distributionX);
    Y = c(distributionY);
    
    if(method == "")
    {
        method = "pearson";
    }
    
    list(correlationCoefficient = cor(X, Y, method = method));
}

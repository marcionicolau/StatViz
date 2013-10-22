getData <- function(dataset = "langley", columnName = "Unemployed")
{
    dataset <- eval(as.name("DATA"));
    
    list(data = dataset);
}
getData <- function(dataset = "langley", columnName = "Unemployed")
{
    list(data = eval(dataset));
}
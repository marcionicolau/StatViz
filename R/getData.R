getData <- function(dataset, columnName = "Unemployed")
{
    table = as.data.frame(dataset);
    
    list(data = eval(table));
}
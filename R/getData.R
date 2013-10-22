getData <- function(data, columnName = "Unemployed")
{
    table = as.data.frame(data);
    
    list(data = eval(table));
}
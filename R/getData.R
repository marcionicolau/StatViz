getData <- function(dataset, columnName = "Unemployed")
{
    assign(paste("table"),dataset);
    
    table <- as.data.frame(table)
    
    list(data = eval(parse(text = paste("table","$",columnName))));
}
getData <- function(dataset = "langley", columnName = "Unemployed")
{
    assign(paste("dataset"),dataset);
    
    list(DATA = eval(parse(text = paste("dataset","$",columnName))));
}
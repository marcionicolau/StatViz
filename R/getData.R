getData <- function(dataset = "langley", columnName = "Unemployed")
{
    assign(paste("DATA"),dataset);
    
    list(DATA = eval(parse(text = paste("DATA","$",columnName))));
}
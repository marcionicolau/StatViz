getData <- function(dataset = "langley", columnName = "Unemployed")
{
    assign(paste("DATA"),dataset);
    
    DATA <- data.frame(DATA)
    
    list(DATA = eval(parse(text = paste(DATA,"$",columnName))));
}
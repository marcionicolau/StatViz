getData <- function(dataset = "langley", columnName = "Unemployed")
{
    assign(paste("DATA"),dataset);
    
    DATA <- as.data.frame(DATA)
    
    list(DATA = eval(parse(text = paste("DATA","$",columnName))));
}
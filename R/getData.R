getData <- function(dataset = "langley", columnName = "Unemployed")
{
    assign(paste("DATA"),data.frame(dataset));
    
    list(DATA = eval(parse(text = paste("DATA","$",columnName))));
}
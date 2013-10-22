getData <- function(dataset = "langley", columnName = "Unemployed")
{
    dataset <- eval(as.name(dataset));
    
    list(data = eval(parse(text = paste(dataset,"$",columnName))));
}
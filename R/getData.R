getData <- function(dataset = "langley", columnName = "Unemployed")
{
    list(data = eval(parse(text = paste(dataset,"$",columnName))));
}
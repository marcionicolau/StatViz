getData <- function(dataset = "langley", columnName = "Unemployed")
{
    list(data = eval(parse(text = "DATA$pid")));
}
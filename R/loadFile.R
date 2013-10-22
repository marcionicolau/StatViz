loadFile <- function(filePath)
{
    eval(parse(text(paste("DATA",=,read.table(filePath, head = T)))));
    
    list(data = "DATA", variableNames = names(DATA));
}
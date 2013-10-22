loadFile <- function(filePath)
{
    DATA = read.table(filePath, head = T);
    
    list(data = "DATA", variableNames = names(DATA));
}
loadFile <- function(filePath)
{
    data = read.table(filePath, head = T);
    
    list(data = data, variableNames = names(data));
}
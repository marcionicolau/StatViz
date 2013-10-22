loadFile <- function(filePath)
{
    DATA = read.table(filePath, head = T);
    
    variableNames = names(DATA)
    
    list(data = DATA, variableNames = variableNames);
    
    
}
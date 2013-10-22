loadFile <- function(filePath)
{
    assign(paste("dataset"), read.table(filePath, head = T));
    
    dataset <- eval(as.name("dataset"));
    
    variableNames = names(dataset)
    
    list(dataset = dataset, variableNames = variableNames);
    
}
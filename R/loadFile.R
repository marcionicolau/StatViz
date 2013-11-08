loadFile <- function(filePath)
{
    fileType = substr(filePath, nchar(filePath) - 3 + 1, nchar(filePath));
    
    if(fileType == "txt")
        assign(paste("dataset"), read.table(filePath, head = T));
    else if(fileType == "csv")
        assign(paste("dataset"), read.csv(filePath, head = T));
    
    dataset <- eval(as.name("dataset"));
    
    variableNames = names(dataset)
    
    list(dataset = dataset, variableNames = variableNames);
    
}
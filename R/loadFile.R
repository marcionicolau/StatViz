loadFile <- function(filePath)
{
    assign(paste("DATA"), read.table(filePath, head = T));
    
    data <- eval(as.name("DATA"));
    
    variableNames = names(data)
    
    list(data = data, variableNames = variableNames);
    
    
}
loadFile <- function(filePath)
{
    assign(paste("DATA"), read.table(filePath, head = T));
    
    DATA <- eval(as.name("DATA"));
    
    variableNames = names(DATA)
    
    list(DATA = "DATA", variableNames = variableNames);
    
}
splitDataByColumnValues <- function(dataset, columnName)
{
    table <- as.data.frame(dataset);
    
    levels = levels(eval(parse(text = paste("table","$",columnName))));
    
    for(i in 1:length(levels))
    {
        assign(paste(levels[i]), subset(paste("table"), paste("table","$",columnName) == paste(levels[i])));
        list(paste(levels[i]) = eval(levels[i]));
    }
    
    
splitDataByColumnName <- function(dataset, columnName, value)
{
    table <- as.data.frame(dataset);
    
    levels = levels(eval(parse(text = paste("table","$",columnName))));
  
    list(data = subset(paste("table"), paste("table","$",columnName) == value));
}  
    
splitDataByColumnName <- function(dataset, columnName, value)
{
    table <- as.data.frame(dataset);
    
    levels = levels(eval(parse(text = paste("table","$",columnName))));
  
    list(data = eval(parse(text = paste("subset(table, ","table$", columnName," == '",value,"')",sep=""))), levels = levels);
}  
    
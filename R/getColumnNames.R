getColumnNames <- function(dataset = "beaver1")
{
  dataset = eval(parse(text = dataset));
  
  colNames = colnames(dataset);
  
  list(colNames = colNames);
}

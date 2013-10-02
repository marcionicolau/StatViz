applyTransform <- function(dataset = "", columnName = "", type = "squareRoot")
{
  if(dataset == "")
  {   
    dataset = "beaver1";
    columnName = "time";
  }
  else if(columnName == "")
  {
    # Load the first column name by default
    columnName = names(eval(parse(text = dataset)))[1]; 
  }
        
  distribution = eval(parse(text = paste(dataset,"$",columnName)));
  
  switch(eval(parse(text = type)),
  
  squareRoot = {
    list( distribution = sqrt(distribution) );
  }
  
  cubeRoot = {
    list( distribution = distribution^(1/3) );
  }
  
  reciprocal = {
    list( distribution = 1/distribution );
  }
  
  logarithm = {
    list( distribution = log10(distribution) );
  }
}
  
  

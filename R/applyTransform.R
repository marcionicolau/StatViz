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
  # type = eval(parse(text = type));
  switch(type,
  squareRoot = {
    _distribution = sqrt(distribution);
  },
  cubeRoot = {
    _distribution = distribution^(1/3);
  },
  reciprocal = {
    _distribution = 1/distribution;
  },
  logarithm = {
    _distribution = log10(distribution);
  })
  
  list(beforeTransform = distribution, afterTransform = _distribution, dataset = dataset, columnName = columnName);
}
  

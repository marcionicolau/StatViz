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
    Distribution = sqrt(distribution);
  },
  cubeRoot = {
    Distribution = distribution^(1/3);
  },
  reciprocal = {
    Distribution = 1/distribution;
  },
  logarithm = {
    Distribution = log10(distribution);
  })
  
  list(beforeTransform = distribution, afterTransform = Distribution, dataset = dataset, columnName = columnName);
}
  

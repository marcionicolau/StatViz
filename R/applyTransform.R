applyTransform <- function(distribution, type = "squareRoot")
{        
  distribution <- c(distribution);
  
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
  

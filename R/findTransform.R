findTransform <- function(distribution)
{
    distribution = c(distribution);

    result = eval(parse(text = paste("shapiro.test(sqrt(distribution))")));
    if(result$p.value > 0.05)
    {
        return "sqrt";
    }

    result = eval(parse(text = paste("shapiro.test(distribution^(1/3))")));
    if(result$p.value > 0.05)
    {
      type = "cube";
    }

    result = eval(parse(text = paste("shapiro.test(1/distribution)")));
    if(result$p.value > 0.05)
    {
      type = "reciprocal";
    }

    result = eval(parse(text = paste("shapiro.test(log10(distribution))")));
    if(result$p.value > 0.05)
    {
      type =  "log";
    }

    type = "none";
    list(type = type);
}
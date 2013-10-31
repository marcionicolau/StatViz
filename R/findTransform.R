findTransform <- function(distribution)
{
    distribution = c(distribution);

    result = eval(parse(text = paste("shapiro.test(sqrt(distribution))")));
    if(!is.nan(result$p.value))    
    {
        if(result$p.value > 0.05)
        {
            type = "sqrt";
        }
    }

    result = eval(parse(text = paste("shapiro.test(distribution^(1/3))")));
    if(!is.nan(result$p.value))    
    {
        if(result$p.value > 0.05)
        {
            type = "cube";
        }
    }

    result = eval(parse(text = paste("shapiro.test(1/distribution)")));
    if(!is.nan(result$p.value))    
    {
        if(result$p.value > 0.05)
        {
            type = "reciprocal";
        }
    }

    result = eval(parse(text = paste("shapiro.test(log10(distribution))")));
    if(!is.nan(result$p.value))    
    {
        if(result$p.value > 0.05)
        {
            type = "log";
        }
    }

    type = "none";
    list(type = type);
}
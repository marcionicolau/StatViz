    getMean <- function(distribution = "") 
    {
        if(distribution == "")
        {
            stop("no distribution entered!");
        }
        else
        {
            list(value = mean(eval(parse(text = distribution))))
        }
    }

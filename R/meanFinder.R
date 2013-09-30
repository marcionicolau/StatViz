    meanFinder <- function(distribution = "") {
        if(distribution == "")
        {
            distribution = rnorm(50, mean=1, sd=1.5)
        }
        
         message = mean(distribution)
    }

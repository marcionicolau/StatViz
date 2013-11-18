getLinearModelCoefficients <- function(outcome, explanatory) 
{       
    outcome <- c(outcome);
    explanatory <- c(explanatory)
    
    model = lm(outcome ~ explanatory);
    results = summary(model);
    
    for(i in 1:length(model$coefficients))
    {   
        if(i == 1)
        {
            intercept = model$coefficients[[i]];
        }
        else
        {
            coefficients = c(coefficients, model$coefficients[[i]]);
        }
    }
    
    list(intercept = intercept, coefficients = coefficients, rSquared = results$r.squared);
}

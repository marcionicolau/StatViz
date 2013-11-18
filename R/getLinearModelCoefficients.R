getLinearModelCoefficients <- function(outcome, explanatory) 
{       
    outcome <- c(outcome);
    explanatory <- c(explanatory)
    
    model = lm(outcome ~ explanatory);
    results = summary(model);
    
    coefficients = model$coefficients
    
    list(intercept = model$coefficients[[1]], coefficients = coefficients, rSquared = results$r.squared);
}

getLinearModelCoefficients <- function(outcome, explanatory) 
{       
    outcome <- c(outcome);
    explanatory <- c(explanatory)
    
    model = lm(outcome ~ explanatory);
    results = summary(model);
    
    list(intercept = model$coefficients[[1]], slope = model$coefficients[[2]], rSquared = results$r.squared);
}

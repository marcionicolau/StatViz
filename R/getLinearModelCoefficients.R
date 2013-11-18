getLinearModelCoefficients <- function(causal, predictor) 
{       
    causal <- c(causal);
    predictor <- c(predictor)
    
    model = lm(causal ~ predictor);
    results = summary(model);
    
    list(intercept = model$coefficients[[1]], slope = model$coefficients[[2]], rSquared = results$r.squared);
}

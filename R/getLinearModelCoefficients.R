getLinearModelCoefficients <- function(causal, predictor) 
{       
    causal <- c(causal);
    predictor <- c(predictor)
    
    model = lm(causal ~ predictor);
    results = summary(model);
    
    list(xIntercept = model$coefficients[[1]], yIntercept = model$coefficients[[2]]);
}

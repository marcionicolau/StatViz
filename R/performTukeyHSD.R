performTukeyHSD <- function(dataset = "")
{
  url = "http://ww2.coastal.edu/kingw/statistics/R-tutorials/text/groceries.txt";
  
  groceries = read.table(url, header=T);
  groceries2 <- stack(groceries);
  subject = rep(groceries$subject,4);
  
  groceries2[3] = subject;
  
  colnames(groceries2) = c("price","store","subject");
  
  result = TukeyHSD(aov(price ~ store, data = groceries2), "store");
  
  list(p = result$store[,4][["storeB-storeA"]], comparison = "storeB - storeA");
}

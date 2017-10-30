## Given the Car.csv dataset, your task is to create the following visuals using D3.js. Please note, this Car.csv file is different than that you were provided in the class. So, make sure to use this new dataset.

1. [20] Draw a pie chart showing the frequency of the column 'brand'. If any brand has frequency less than 100, discard it in the pie. Your visual should have proper labeling of the pies with the brand name and frequency. For example, "bmw [1143]".
2. [30] Draw a tree using D3.jstree layout showing the "brand"---"model"---"name" hierarchy. If any brand has frequency less than 100, discard it in the tree.For each brand, only show the top 3 most frequent models. For each model, only show the top 5 most frequent names. Your tree must have proper labeling with text and frequency. For example, "Opel_corsa [13]". You can assume all the brand nodes are under a node named "Car".
3. [30] Draw a bubble pack chart using D3.js following the conditions in task 2. The size of the bubbles should reflect the frequency of the items. 
4. [10] Your code should have proper documentation. 
5. [10] Submittable: In a single zipped file, you will need to submit the following things:
    * The data file Car.csv
    * The d3.js file
    * All the codes [html, css, javascript]
    * Screenshots of the three visuals in png format
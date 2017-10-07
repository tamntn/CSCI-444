import csv
import os
import numpy as np
from numpy import median

file_name = "table5_2014.csv"
input_file = open(file_name, 'r')	#Open csv file
input_file = csv.reader(input_file)

year = []
all_accidents = []
fatal_accidents = []

total_fatalities = []
aboard_fatalities = []

flight_hours = []
miles_flown = []
total_departures = []

accidents_per_flight_hours = []
fatal_per_flight_hours = []

accidents_per_miles_flown = []
fatal_per_miles_flown = []

accidents_per_departure = []
fatal_per_departure = []

row_num = 1

for row in input_file:
	if(row_num >= 6 and row_num <=37):
		year.append(row[0])
		all_accidents.append(int(row[2]))
		fatal_accidents.append(int(row[3]))
		total_fatalities.append(int(row[4]))
		aboard_fatalities.append(int(row[5]))

		flight_hours.append(int(row[6].replace(",","")))
		miles_flown.append(int(row[7].replace(",","")))
		total_departures.append(int(row[8].replace(",","")))

		accidents_per_flight_hours.append(float(row[9]))
		accidents_per_miles_flown.append(float(row[11]))
		accidents_per_departure.append(float(row[13]))

		if('-' in row[10]):
			fatal_per_flight_hours.append(0.0)
			fatal_per_miles_flown.append(0.0)
			fatal_per_departure.append(0.0)
		else:
			fatal_per_flight_hours.append(float(row[10]))
			fatal_per_miles_flown.append(float(row[12]))
			fatal_per_departure.append(float(row[14]))
	row_num = row_num + 1

# Total number of year in database
number_of_year = len(year)

# Calculate Range, Mean, Median, Standard Deviation, Variance and other basic stuffs

range_all_accidents = max(all_accidents) - min(all_accidents)
mean_all_accidents = sum(all_accidents)/float(number_of_year)
median_all_accidents = median(all_accidents)
std_all_accidents = np.std(all_accidents)
var_all_accidents = np.var(all_accidents)

range_total_fatalities = max(total_fatalities) - min(total_fatalities)
mean_total_fatalities = sum(total_fatalities)/float(number_of_year)
median_total_fatalities = median(total_fatalities)
std_total_fatalities = np.std(total_fatalities)
var_total_fatalities = np.var(total_fatalities)

range_miles_flown = max(miles_flown) - min(miles_flown)
mean_miles_flown = sum(miles_flown)/float(number_of_year)
median_miles_flown = median(miles_flown)
std_miles_flown = np.std(miles_flown)
var_miles_flown = np.var(miles_flown)

print range_all_accidents
print mean_all_accidents
print median_all_accidents
print std_all_accidents
print var_all_accidents

print range_total_fatalities
print mean_total_fatalities
print median_total_fatalities
print std_total_fatalities
print var_total_fatalities

print range_miles_flown
print mean_miles_flown
print median_miles_flown
print std_miles_flown
print var_miles_flown

#Print the numpy package path
#print np.__path__



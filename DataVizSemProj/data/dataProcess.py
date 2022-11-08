import csv

filename = "data/vgsales.csv"

#init
data = []
minMax = [3000,0]
def getKey(val):
    return val['Year']

sumData = {}
#read csv
with open(filename, 'r') as cf:
    
    csvreader = csv.DictReader(cf)
 
    for row in csvreader:
        curData = {}
        yearData = {}
        if row['Year'] != 'N/A':
            #Get Data
            Year = int(row['Year'])
            curData['Year'] = Year
            curData['NA_Sales'] = float(row['NA_Sales'])
            curData['EU_Sales'] = float(row['EU_Sales'])
            curData['JP_Sales'] = float(row['JP_Sales'])
            curData['Other_Sales'] = float(row['Other_Sales'])
            curData['Global_Sales'] = float(row['Global_Sales'])
            data.append(curData)

            #Check for Min and Max
            if Year < minMax[0]:
                minMax[0] = Year
            if Year > minMax[1]:
                minMax[1] = Year

for i in range(minMax[0],minMax[1]+1):
    sumData[str(i)] = {
        "NA_Sales": 0,
        "EU_Sales": 0,
        "JP_Sales": 0,
        "Other_Sales": 0,
        "Global_Sales": 0
    }

for d in data:
    sumData[str(d['Year'])]['NA_Sales'] += d['NA_Sales']
    sumData[str(d['Year'])]['EU_Sales'] += d['EU_Sales']
    sumData[str(d['Year'])]['JP_Sales'] += d['JP_Sales']
    sumData[str(d['Year'])]['Other_Sales'] += d['Other_Sales']
    sumData[str(d['Year'])]['Global_Sales'] += d['Global_Sales']

sumArr = [] 
print(sumData)
for d in sumData:
    cur = sumData[d]
    new = {}
    new['Year'] = d
    new['NA_Sales'] = sumData[d]['NA_Sales']
    new['EU_Sales'] = sumData[d]['EU_Sales']
    new['JP_Sales'] = sumData[d]['JP_Sales']
    new['Other_Sales'] = sumData[d]['Other_Sales']
    new['Global_Sales'] = sumData[d]['Global_Sales']
    sumArr.append(new)

with open('saleTrends.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames = ['Year','NA_Sales','EU_Sales','JP_Sales','Other_Sales','Global_Sales'])
    writer.writeheader()
    writer.writerows(sumArr)
    


    




def gScore(n,v):
    return {'Name': n, 'Score':v}

example = [gScore('Clark',15),gScore('Hal',12),gScore('Bruce',9),gScore('Diane',3)]

out = []
def gSort(gArr):
    gArr = sorted(gArr, key = lambda x: x['Score'])
    for x in gArr:
        out.append(x['Name'])
    return out

print(gSort(example))

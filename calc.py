from random import choice

sample = [
    ["Liat", 2, ("Plain",)],
    ["Ofir", 3, ("Mushroom",)],
    ["Moshi", 3, ("Mushroom", "Onion")],
    ["Bakshi", 3, ("Pineapple", "Bulgarit", "Tomato")],
]


def topping_rarity(topping):
    global sample
    return sum([topping in person[2] for person in sample])


toppings = []
for person in sample:
    toppings.extend(person[2])

toppings = set(toppings)

toppings_to_rarity = {}
for topping in toppings:
    toppings_to_rarity[topping] = topping_rarity(topping)


def highest_rarity(person):
    toppings = person[2]
    rarities = []
    for topping in toppings:
        rarities.append(toppings_to_rarity[topping])
    return max(rarities)


sample.sort(key=highest_rarity)

# Now our sample is sorted by rarity: The people with the most rare toppings are first
order = []
def odd_toppings(order):
    topping_count = {}
    for name, topping in order:
        topping_count[topping] = topping_count.setdefault(topping, 0) + 1
    odd_topping_list = []
    for topping, count in topping_count.items():
        if count % 2 != 0:
            odd_topping_list.append(topping)
    return odd_topping_list

for person in sample:
    person_toppings = set(person[2])
    needed_toppings = set(odd_toppings(order))
    inter = list(needed_toppings.intersection(person_toppings))
    while needed_toppings and person[1] > 0 and inter:
        order.append((person[0], inter[0]))
        person[1] -= 1
        needed_toppings = set(odd_toppings(order))
        inter = list(needed_toppings.intersection(person_toppings))
    favorite_topping = choice(person[2])
    while person[1] > 0:
        order.append((person[0], favorite_topping))
        person[1] -= 1

needed_toppings = odd_toppings(order)
while needed_toppings:
    order.append(("Public", needed_toppings[0]))
    needed_toppings = odd_toppings(order)

while len(order) % 8 != 0:
    order.append(("Public", "Plain"))

order.sort(key=lambda x: x[1])

from pprint import pprint
for pizza in range(0, len(order), 8):
    print "Pizza:"
    print "======"
    pprint(order[pizza:pizza+8])
    print


my_generator = (i for i in range(10000000))
my_generator2 = [i for i in range(10000000)]
print(my_generator.__sizeof__())
print(my_generator2.__sizeof__())
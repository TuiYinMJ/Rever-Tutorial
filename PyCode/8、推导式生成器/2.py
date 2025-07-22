def count_up_to(max_val):
    print("生成器开始")
    count = 0
    while count <= max_val:
        yield count
        # 产出count值，然后在这里暂停
        # 下次调用next()的时候，从这里执行
        count += 1
    print("结束")

counter = count_up_to(5)
for n in counter:
    print(n)
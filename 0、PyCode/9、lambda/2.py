def make_addr(n):
    # 执行进来，但是没有代码内容，n会用到，保留
    def adder(x):
        return x+n
    # 返回函数地址
    return adder

add = make_addr(5) # 调用函数，传入参数5
add_10 = make_addr(10)

print(add(5)) # 拿到函数地址，传入x，x+n=5+5=10
print(add_10(10))
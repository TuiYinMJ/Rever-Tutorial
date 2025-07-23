import time


def timer(func):
    def wrapper(*args,**kwargs):
        start_time = time.time()
        result = func(*args,**kwargs) # 调用被装饰的函数
        end_time = time.time()
        print(f"运行耗费：{end_time - start_time}s")
        return result
    return wrapper

@timer
def heavy():
    for i in range(1000):
        pass

heavy()

# @timer语法糖等价于，heavy = timer(heavy)
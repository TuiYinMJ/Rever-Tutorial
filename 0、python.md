有些时候，往往需要借助Python等来写一些脚本辅助我们来完成工作，所以基础的Python过一下

## Python

安装Python什么的和Visual Studio的方法百度太多了，不说了
和C语言的区别就是代码量少，C语言是编译型的，先把代码全部完整翻译成机器语言，才能运行，Python是解释型的，写一行就翻译一句执行一句这吊样

### 1、变量
变量：贴标签的盒子，比如我把打火机放到一个盒子里，贴标放松用品，这个贴了标签的盒子就是变量，盒子里的是值，标签是变量名，=是赋值，my_ddlong = 20

Python是一个动态类型的，无需告诉str、int等，会自动识别

且有不可变类型，比如：int、float、bool、str、tuple
```python
x = 10
print(id(x))
x = 20
print(id(x))
```
上面的 2 个 x 是一个吗？其实不是，修改的时候，Python 会创建一个新的对象，然后把标签贴过去，旧数据没人用了，就会被回收

像是 list、dict、set，这是可变的，添加等，都不会开辟新的地方去操作

变量的作用域：LEGB
- L: Local，局部的，在函数内定义的，外部无效
- E: Enclosing，闭包函数外的函数作用域
- G: Global，全局的，在函数外定义的，外部有效
- B: Built-in，内建的，Python 内建的函数，比如 print 等
查找也是按照 LEGB 的顺序查找

如果在函数内用全局的变量，需要用到 global关键字，在内层函数修改外层函数变量，就要用 nonlocal

虽然是个动态类型，但是我们可以添加类型说明
```python
name: str = 'xiaoming'
```

虽然不强制，但是还是有数据类型滴

最常见的类型：
- 数字
	- int：10、-5、0
    - float：3.14、-0.5
- 字符串str：单引号和双引号括起来的还有三引号
- 序列
  - list
  - tuple
- 映射
  - dict
  - set
- bool
- NoneType，只有一个值 None，代表空，不存在

```python
great_str = "hello"
g2str = "world"

print(great_str + g2str)
print(great_str[1]) # 切片
print(f'{great_str} {g2str}') # 格式化
```

str 上也有一些常用的方法，加乘可以自己试一试，比较简单，其他的常用方法如下：
- .upper()，转大写
- .lower()，转小写
- .title()，每个单词转大写开头
- .capitalize()，第一个单词转大写开头
- .find('sub')，查找 sub，返回索引，没有-1
- .index('sub')，找不到报错
- .startswith('pre')，判断开头
- .endswith('suf')，判断结尾
- .count('a')，统计 a 出现的次数
- .strip()，去掉首尾空格,lstrip/rstrip
- .replace('a', 'b')，替换 a 为 b
- ''.join(iterable)，将可迭代对象连接为字符串
- .split('delim')，将字符串按 delim 分割为列表

### 2、容器
如果存储一组数据，就要用容器，列表、元组、字典、集合

列表List 随时可以修改，有序、可存放任何类型、可变，[]表示，逗号分隔元素
```python
re_tools = ["IDA Pro", "x64dbg", "Ghidra", "Wireshark"]
```
访问可以用索引，比如re_tools[0]，甚至加上=去修改，或者
- .append()尾部添加
- .insert(index,value)插入
- .pop()最后一个
- .remove(item) 匹配项删除
- .extend(list),将一个可迭代对象，比如另一个列表，追加到末尾
- .clear()，清空
- .sort()排序,reverse=True倒序
- .reverse() 反转
- .index(item) 返回 item 第一次出现的索引，找不到报错
- .count(item) item出现的次数

元组Tuple，不可变，就是一个不可变的列表()表示，其他一样，常用的就是index和count


字典Dict，{}很强大， 键值对的形式
```python
# 创建一个用户档案字典
user_profile = {
    "name": "IDA Pro",
    "age": 34,
    "city": "bilishi",
    "is_vip": True
}
```
不能有相同的键，键必须是不可变的，字符串或者数字
```python
# 访问
user_profile["name"] 
# user_profile["name"] = "IDA" 赋值修改

user_profile["other"] = "Cutter" # 添加
del xxx[] # 删除

for key,value in user_profile.items():
		print(f"key:{key},value:{value}")
```
- .get(key,default=None)，通过键获取，没有就返回 default值
- .keys() 返回包含所有键
- .values() 包含所有值
- .items() 包含所有键值对，元组
- .update(dict) 用另一个字典批量更新当前字典
- .pop(key,default) 删除且返回指定键的值，不存在且未提供 default 报错
- .popitem()，删除并返回最后插入的键值对


set集合，无序不可重复，没有key的字典
```python
file_extensions = {".exe", ".dll", ".txt", ".exe", ".sys"}
print(file_extensions)
```
用来去重、in成员检测等
- .add(item)，添加一个元素，存在什么都不做
- .update(iterable)，添加一个可迭代对象的所有元素
- .remove(item)，删除一个元素，不存在报错
- .discard(item)，删除一个元素，不存在不会报错
- .pop()，随机删除并返回一个元素
- .clear()，清空

数学运算的集合
- .union(other_set) 或者 set1|set2，合并，去重
- .intersection(set) 或 set1&set2，都有的部分
- .difference(set) 或 set1-set2，set1 中 set2 里没有的
- .symmetric_difference(set) 或 set1^set2，只在其中一个集合出现的元素

### 3、流程控制
- if 如果，最基本的
```python
if file_size > 1000:
		print("台大了")
```
- if else，多一个分支，不成立的
- if elif else，多个判断分支
```python
if user == "admin":
    print("欢迎管理员")
elif user == "editor":
    print("欢迎编辑")
else:
    print("欢迎访客")
```
且可以简化三元运算符
```python
result = "及格" if score >= 60 else "不及格"
```



循环：
- for 遍历
用来循环可迭代对象，比如list/tuple/str/dict/set/range
```python
re_tools = ["IDA Pro", "x64dbg", "Ghidra"]

# tool这个变量，会依次等于列表中的每一个元素
for tool in re_tools:
    print(f"正在分析工具: {tool}")

# range()指定次数的循环
for i in range(5): # range(5) 会生成 0, 1, 2, 3, 4
    print(f"第 {i+1} 次循环。")

# enumerate() 带索引
for index,f in enumerate(re_tools):
    print(f"index{index}:{f}")
```


- while
```python
countdown = 5
while countdown > 0:
    print(countdown)
    countdown = countdown - 1 # 必须改变条件，否则无限循环
print("发射！")
```

- 海象运算符 := , 3.8以后加的
这个可以在表达式内部赋值
```python
while True:
    command = input("输入指令，quit退出")
    if command == "quit":
        break
    print(command)

# 简化
while(command := input("输入指令，quit退出")) != "quit":
    print(command)
```
意思很明显

控制循环的关键字：
- break 跳出
- continue 开始下次循环
- else，循环的 else 会在循环正常结束，没有被 break 中断的时候执行

match case, 3.10以后增加的，获取一个对象，将一个或者多个 case 模式比较
```python
def http_status(status):
    match status:
        case 200:
            return "OK - Code 200"
        case 404:
            return "Not Found"
        case _:
            return "通配符，匹配其他任何情况"
```
甚至可以这样用
```python
# command = ["move", 100, 200]
command = ["draw", "circle", {"radius": 50}]
# command = ["quit"]

match command:
    case ["move", x, y]:
        print(f"移动到坐标 ({x}, {y})")

    case ["draw", shape, {"radius": r}]:
        print(f"绘制图形 {shape}，半径为 {r}")

    case ["draw", shape, *options]:  # *options 匹配任意多个额外项
        print(f"绘制图形 {shape}，选项为 {options}")

    case ["quit"]:
        print("正在退出...")

    case _:
        print("未知指令")
```

### 4、函数
为了完成某个工作，防止每次都重复性操作，专门复用的
def 定义函数
```python
def get(name):
		message = f"你好, {name}! 欢迎来到函数的世界。"
        return message
zhangsan = greet("张三")
# 张三就是实参
```
上面的就是位置参数，一一对应
```python
get(name="Willy") # 顺序不重要，多个的时候有用
```
默认参数
```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")
```
不传递第二个就默认 Hello
```python
def calculate_sum(*numbers):
    print(f"Received numbers: {numbers}") # numbers 是一个元组
```
任意数量的参数
```python
def build_profile(**user_info):
    print(f"Received info: {user_info}") # user_info 是一个字典

name="John Doe", age=30, city="New York"
```
任意关键字参数

3.5 以后也是，可以协商返回值类型了
```python
def format_greeting(name: str, age: int) -> str
```
还有更简洁的
```python
def my_func(pos_only, /, standard, *, kw_only):
```
/前面的参数只能通过位置传递，*后面的只能通过关键字传递

```python
def get_file_type(filename):
    """接收一个文件名字符串，返回它的类型字符串。"""
    if filename.endswith(".exe"):
        return "可执行文件"
    elif filename.endswith(".dll"):
        return "动态链接库"
    elif filename.endswith(".docx") or filename.endswith(".jpg"):
        return "文档或图片"
    else:
        return "未知类型"

files_to_scan = [
    "calc.exe", 
    "document.docx", 
    "kernel32.dll", 
    "image.jpg", 
    "unknown.dat", 
    "malware.exe"
]

print("--- 开始扫描文件 ---")
for file in files_to_scan:
    file_type = get_file_type(file)
    print(f"文件名: {file:<25} | 类型: {file_type}")
print("--- 扫描结束 ---")
```
练习下没事多

还有第 9 小节的 lambda 匿名函数

### 5、导入
现在我们已经可以把逻辑都封斋干到一个函数里了，但是若我们有成千上万的函数，一个用于检查，一个用于分析，一个用于解析，都在一个py里，变得难以维护
我们就可以把这个做成一个工具，用到拿过来直接用，就是模块

模块就是一个py文件，文件里可以写任何函数、类、变量

比如导入一个官方的模块
```python
import math
math.pi # 必须通过模块名称.访问内部的函数和变量

# 还有另一种
from math import pi,sqrt # 只导入pi和sqrt，这个不用.了

import pandas as pd # 简写别名，防止冲突和方便使用

from math import pi as pai # 也可以
```

包，则是装着多个模块的文件夹，要让Python识别包，需要__init__.py文件
init告诉Python这个文件夹是一个可以被导入的包

```python
from my_pack import calc # my_pack包下的calc模块
from my_pack.strings import my_str # my_pack包下的strings模块里的my_str
```

Python自带的标准库也足以我们使用
- os，和系统交互
- sys，和Python解释器交互
- re，正则匹配
- struct，二进制数据解析
- socket，网络编程
random等等

### 6、文件I/O
文件交互和我们正常编辑一样。需要打开-读写-关闭
为了防止忘记关闭或者意外情况，可以使用with语法
```python
with open("file_name",'mode') as f:
    f.write("text")
    f.read()
    pass
```
做个演示
- r 只读
- w 写入，且清空原内容
- a 追加
- b 二进制模式
- rb 二进制读取
- wb 二进制写人
```python
# 使用'w'模式，第一次会创建并清空文件
with open("app.log", "w", encoding="utf-8") as f:
    f.write("日志系统启动...\n")
    f.write("2025-07-21 10:00 - INFO: 用户模块初始化成功。\n")

# 使用'a'模式，在文件末尾追加内容
with open("app.log", "a", encoding="utf-8") as f:
    f.write("2025-07-21 10:01 - WARNING: 网络连接不稳定。\n")

print("日志已写入到 app.log 文件。")
```
写入示例
```python
print("\n--- 读取日志内容 ---")
try:
    with open("app.log", "r", encoding="utf-8") as f:
        # 读取文件所有行，并像遍历列表一样遍历它们
        for line in f:
            # .strip()可以去掉每行末尾的换行符，让输出更整洁
            print(line.strip())
except FileNotFoundError:
    print("错误：日志文件未找到！")
```
读取示例

稍微说下方法：
- .read() 读取整个文件，若文件很大，非常耗内存
- .readline()/.readlines()
  - 读取一行 和 读取所有行返回一个字符串列表，每行是列表的一个元素，也有内存风险
很大的文件就是按行迭代比较好
```python
lines_processed = 0
with open('large_log.txt', 'r', encoding='utf-8') as f:
    for line in f: # f 本身就是一个可迭代对象
        print(line.strip()) # .strip() 用于去除行尾的换行符 \n
        lines_processed += 1
print(f"总共处理了 {lines_processed} 行。")
```
- .write()，写入，不会加换行
- .writelines()，写入多行，需要自己加换行符

以及模拟判断文件
```python
# 已知PNG文件头
PNG_SIGNATURE = b"\x89\x50\x4e\x47"

filename = "my_image.png"

try:
    # 使用二进制读取模式 'rb'
    with open(filename, "rb") as f:
        # 只读取文件最开头的4个字节
        header = f.read(4)

        print(f"文件名: {filename}")
        print(f"读取到的文件头 (bytes): {header}")

        # 比较读取到的头部和已知的签名
        if header == PNG_SIGNATURE:
            print("结论: 这是一个有效的PNG图片！")
        else:
            print("结论: 这不是一个有效的PNG图片。")

except FileNotFoundError:
    print(f"错误: 文件 {filename} 未找到！")
```

### 7、异常
程序永远无法成为完美的理想状态，终究可能因为某些事情产生崩溃

异常：程序在执行的时候，发生了意外

常见的错误：
- ZeroDivisionError, 除0错误
- ValueError，无法把非数字字符串转整数
- FileNotFoundError，尝试打开不存在的文件
- KeyError，访问不存在的键


在Python中，有可能崩溃的语句，都放入try中，except就是若try里的语句真的产生了错误，程序会执行except里的语句
```python
filename = "non_existent_file.txt"

try:
    with open(filename, "r") as f:
        content = f.read()
        print(content)
except FileNotFoundError:
    print(f"错误：文件'{filename}'不存在！请检查文件名是否正确。")
except PermissionError:
    print(f"错误：没有权限读取文件'{filename}'。")
except Exception as e:
    print(f"发生了一个未知错误: {e}")
else:
    # try完全成功
finally:
    # 无论成功失败
```
如上，比如觉得读取一个文件会出错，那么我给他try一下
还有else和finally，else是可选的，里面的代码会在try没有发生任何异常的情况下执行
finally无论如何都会执行，可以自己动手加上这两个试一试

尽量捕获精确的异常类型，而不是宽泛的Exception，这样可以针对不同的做出不同处理

还有主动跑出异常raise
```python
def set_age(age):
    if age < 0:
        # 如果年龄不符合业务规则，我们主动抛出一个 ValueError
        raise ValueError("年龄不能为负数！")
    print(f"年龄已设置为: {age}")

try:
    set_age(25)   # 正常
    set_age(-5)   # 这会触发 raise
except ValueError as e:
    print(f"设置失败: {e}")
```
自定义异常
```python
# 自定义异常类，继承基类
class MyCustomError(Exception):
    pass
```
用的时候就用raise正常抛，捕获也正常用这个名字捕


### 8、列表推导式和生成器
比如，我有一个列表\[1,2,3,4,5,6\]，我想要得到一个新的列表，其内容是前面这个列表每个元素的平方，我们在之前可能这样写
```python
numbers = [1, 2, 3, 4, 5]
squares = []
for n in numbers:
    squares.append(n * n)
print(squares)
```
虽然很清晰，但不简洁
```python
numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers]
print(squares)
```
一样的，\[表达式 for 元素 in 列表\]，甚至可以加入if语句
```python
numbers = [1, 2, 3, 4, 5]
even_squares = [n * n for n in numbers if n % 2 == 0]
print(even_squares)
```
稍微看一看很容易看懂，只是把语句缩写简写了

还有字典推导式
```python
square_dict = {x:x*x for x in range(5)}，生成0:0 1:1 2:4...
```


生成器，更懒惰，推导式会在内存里立刻创建出一个完整的新列表，如果处理一个包含很大的列表，消耗的内存很大，生成器可以解决

推导式 = 要求1000个，就立马弄1000个
生成器 = 要求1000个，但一个都不搞，你用了，他给你你要的对应的，要的时候就用next()

```python
my_generator = (i for i in range(10000000))
```
方括号变圆括号即可
看两个大小就可以看出
```python
my_generator = (i for i in range(10000000))
my_generator2 = [i for i in range(10000000)]
print(my_generator.__sizeof__())
print(my_generator2.__sizeof__())
```
还有比较复杂的时候，简单的表达式无法完成了，就要用到函数，一个函数用了yield，就成了一个生成器函数，yield和 return 不同，return 会终止函数，而yield会产出一个值，并且暂停函数执行，函数的状态（包括局部变量）会被保存下来，下次请求值的时候，函数从上次暂停的地方继续执行
```python
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
print(counter)
```
返回的是一个生成器对象，可迭代，用for循环遍历也没问题
```python
counter = count_up_to(5)
for n in counter:
    print(n)
```
或者使用next函数手动迭代，这个生成器也是一次性的，遍历完了以后，就空了，想再遍历，就要创建一个新的生成器对象

```python
all_files = [
    "document.docx",
    "image.JPG",
    "malware.exe",
    "script.py",
    "photo.jpeg",
    "important.DLL",
]

image_files_pythonic = [
    f for f in all_files if f.lower().endswith(".jpg") or f.lower().endswith(".jpeg")
]

print(f"列表推导式找到的图片: {image_files_pythonic}")


filenames_only = [f.rsplit(".", 1)[0] for f in all_files]
print(f"只有文件名: {filenames_only}")
```

还是多动手

### 9、lambda和高阶函数
def定义的函数，都有函数名，让我们反复使用

但是有时候，我们需要一个功能特简单，且只用一次的临时的，可以用lambda，创建匿名临时的函数

lambda 参数:表达式

```python
add = lambda x, y: x + y
print(add(3, 4)) # 输出: 7

students = [
    {"name": "Alice", "score": 88},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 82},
]
sorted_students = sorted(students, key=lambda student: student["score"], reverse=True)
# 意思就是
# sorted 函数排序，且是 reverse 降序
# 依据student['score']
```
lambda 追求简洁，不是强大，不要看那些故意绕弯子的

高阶函数：
- 接受一个或者多个函数作为参数
- 把一个函数作为返回值
二者满足其一，则是高阶函数.

一些内置的高阶函数
- map(函数,列表)，把一个函数，依次作用于列表的每一个元素，且返回新的结果
```python
numbers = [1, 2, 3, 4]
# 使用map和lambda，将列表中每个数都乘以2
doubled_numbers = list(map(lambda x: x * 2, numbers))
print(doubled_numbers)
```
- filter(函数,列表)，过滤
```python
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers) 
```
- sorted(list,key=func)，对列表排序
```python
names = ["Alice", "Dragon", "Bob", "Charlie"]
sorted_names = sorted(names, key=lambda name: len(name))
print(sorted_names)
```
按照字符串长度排序

综合利用
```python
files = [
    ("report.docx", 1024),
    ("image.jpg", 5120),
    ("archive.zip", 25600),
    ("script.py", 512)
]
print(f"原始情报: {files}\n")

# 任务1: 使用 map，将所有文件大小从Bytes转换为KB
print("--- 任务1: 转换为KB ---")
files_in_kb = list(map(lambda f: (f[0], f[1] / 1024), files))
print(files_in_kb)
print("-" * 25 + "\n")

# 任务2: 使用 filter，筛选出所有大于4KB (4096 Bytes) 的大文件
print("--- 任务2: 筛选大文件 ---")
large_files = list(filter(lambda f: f[1] > 4096, files))
print(large_files)
print("-" * 25 + "\n")

# 任务3: 使用 sorted，根据文件大小，从小到大对情报进行排序
print("--- 任务3: 按大小排序 ---")
sorted_files = sorted(files, key=lambda f: f[1])
print(sorted_files)
print("-" * 25 + "\n")
```

还有把函数作为返回值
比如闭包：
```python
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
````

还有装饰器，装饰器是最重要最广泛的应用，意思就是还是一个高阶函数，接受一个函数做参数，返回一个增强的函数
```python
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
```


### 10、面向对象
目前来说，所有学习的一切都零零散散，数据一个，输出一个，当程序变大，数据和操作分离的方法很难操控

面向对象，OOP，把数据和方法捆绑在一起，形成一个对象，通过对象构建程序

很经典的比喻就是类 Class 就是一个饼干模具，对象 Obj 就是真正的饼干
```python
class File:
    # 初始化用，新对象创建，自动调用
    def __init__(self,filename,filesize):
        # 对象的属性
        self.name = filename
        self.size = filesize
        print(f"{self.name}创建了")
    # 自定义的方法
    def display_info(self):
        print(f"文件名称{self.name}")
        print(f"文件大小{self.size}")
```
- \_\_init\_\_(self)，构造函数，初始化
- self，代表对象本身，当display_info方法被调用，self 就指向那个调用它的具体的实例

面向对象的三大支柱：
- 封装，把属性和方法包装在一起，且对外隐藏实现细节，暴露有限的接口交互
- 继承，继承 一个已经存在的类，比如前面的异常继承已经存在的基类
- 多态，多种形态，不同对象，调用同一个方法，表现不同

#### 继承、多态
继承：就像遗传学，子类会继承父类的属性和方法，父类就是基类，子类就是派生类
且子类可以对从父类继承过来的方法进行重写
super()召唤父辈的力量

多态：下达同一个命令，但可以得到不同的响应，也就是不同的子类，调用同一个方法，表现出不同的行为

```python
class File:
    def __init__(self, filename, filesize):
        self.name = filename
        self.size_in_bytes = filesize
        print(f"一个通用的文件对象 '{self.name}' 被创建了。")

    def display_info(self):
        print(f"--- 文件: {self.name} ---")
        print(f"大小: {self.size_in_bytes} Bytes")

class ExecutableFile(File):  # 继承自File类
    def __init__(self, filename, filesize, imported_dlls):
        # 使用super()调用父类的__init__来初始化通用属性
        super().__init__(filename, filesize)
        # 添加子类独有的属性
        self.imported_dlls = imported_dlls
        print("  -> 它是一个可执行文件。")

    # 重写父类的display_info方法
    def display_info(self):
        super().display_info()
        print(f"导入的DLL: {self.imported_dlls}")

class TextFile(File):  # 继承自File类
    def __init__(self, filename, filesize, encoding):
        super().__init__(filename, filesize)
        self.encoding = encoding
        print("  -> 它是一个文本文件。")

    # 重写display_info方法
    def display_info(self):
        super().display_info()
        print(f"编码格式: {self.encoding}")

exe_file = ExecutableFile("malware.exe", 20480, ["kernel32.dll", "user32.dll"])
txt_file = TextFile("readme.txt", 1024, "UTF-8")

print("\n--- 多态演示 ---")
all_files = [exe_file, txt_file]

for f in all_files:
    f.display_info()
    print("-" * 20)
```

#### 封装与特殊方法
封装的核心思想：
- 将属性和方法捆绑在一起，通过 class 完成了
- 隐藏内部状态，对外暴露安全的接口交互
就像开车一样，汽车只给你留下了方向盘，油门刹车和挂档，这都是安全的接口，你不用也不应该去看内部如何实现的这个功能，因为可能会出问题

Python 没有强制的 private 权限等，不严格，君子的约定
- _下划线开头的，比如self._name，说明这是一个受保护的，不要外部调用
- 两个下划线的 ，会触发名字改编，在外部无法访问，是个伪私有，通过其他手段还是可以访问

特殊方法：
- \_\_str\_\_(self)，对一个对象 print 或者 str 的时候，自动调用
- len(self)，对一个对象使用 len 的时候
- repr(self)，在交互式终端输入对象名且直接回车的时候

构建密码检查器
```python
import string


class Password:
    def __init__(self,password_str):
        # 封装保护属性
        self._password = password_str
        self._score = 0
        self._feedback = []

        # 自我分析
        self._calc_str()

    def _calc_str(self):
        if len(self._password) >= 6:
            self._score += 1
        else:
            self._feedback.append("密码长度不够")

        has_upper = any(c.isupper() for c in self._password)
        has_lower = any(c.islower() for c in self._password)
        has_digit = any(c.isdigit() for c in self._password)
        has_special = any(c in string.punctuation for c in self._password)

        if has_upper and has_lower and has_digit and has_special:
            self._score += 4
        else:
            self._feedback.append("密码必须包含大写、小写、数字、特殊字符")

    def get_verdict(self):
        if self._score >= 4:
            return "密码强度高"
        else:
            return "密码强度低"

    def __str__(self):
        return f"密码: '{"*" * len(self._password)}' | 强度: {self.get_verdict()}"

    def __len__(self):
        return len(self._password)


test_passwords = ["12345", "abcdefgh", "ABCDEFGH", "Abcdefg1", "StrongP@ss123"]

print("--- 开始进行面向对象的密码分析 ---\n")
for pwd_str in test_passwords:
    pwd_obj = Password(pwd_str)

    # 直接打印对象，会自动调用__str__
    print(pwd_obj)
    # 使用len()，会自动调用__len__
    print(f"  长度: {len(pwd_obj)}")

    # 打印详细的反馈信息
    if pwd_obj._score < 5:
        print(f"  建议: {', '.join(pwd_obj._feedback)}")

    print("-" * 35)
```

### 11、os/sys
- os.getcwd()，获取当前工作目录
- os.listdir(path)，列出指定目录下的所有文件和目录
- os.mkdir(path)，创建目录
- os.remove(path)，删除文件
- os.path.join(path1, path2)，拼接路径
- os.path.exists(path)，判断路径是否存在
- os.path.isfile(path)，判断路径是否为文件
- os.path.isdir()，是否目录
- os.system(command)，执行命令
- os.makedirs('dir1/dir2')，递归创建多级目录
- os.rmdir()，删除空目录
- os.rename()，重命名文件或者目录
- os.getenv('VAR_NAME')，获取一个环境变量的值
- os.environ，获取所有环境变量，返回一个字典


os和系统交互,sys和python交互
- sys.argv，命令行参数列表
- sys.exit() 退出
- sys.version，解释器版本
- sys.platform，系统标识

一个遍历
```python
import os
import sys


def list_directory_tree(start_path, prefix=""):
    try:
        dir_contents = os.listdir(start_path) # 遍历目录内容
        dir_contents.sort() # 排序

        for i, item in enumerate(dir_contents):
            full_path = os.path.join(start_path, item) # 拼接路径完整

            is_last = i == len(dir_contents) - 1 # 判断是否是最后一个
            connector = "└── " if is_last else "├── " # 连接符，如果为真，则使用└──，否则使用├──

            print(prefix + connector + item) # ""+连接符+完整路径

            if os.path.isdir(full_path): # 判断是否是目录
                new_prefix = prefix + ("    " if is_last else "│   ") # 如果是就"" + 符号
                list_directory_tree(full_path, new_prefix) # 递归调用

    except PermissionError:
        print(prefix + "└── [无权访问]")


if len(sys.argv) > 1: # 获取命令行参数
    root_path = sys.argv[1] # 获取第一个参数
else:
    root_path = "." # 也就是说如果没有命令行参数，就用当前的工作目录

if not os.path.isdir(root_path):
    print(f"错误: '{root_path}' 不是一个有效的目录。")
    sys.exit(1) 


print(root_path)
list_directory_tree(root_path)
```

3.4后，有一个pathlib
```python
from pathlib import Path

p = Path('path')
```
- .parent，获取父目录
- .name，获取文件名
- .suffix，获取文件后缀
- .mkdir，创建目录
- .exists，是否存在
- .write_text 和 .read_text写入和读取文本



### 12、re
正则表达式，就是一个超级的查找工具，比如：找出所有a开头的，所有符合电话规则的，所有符合邮箱规则的

核心的字符：
- . 任意字符，除了换行符，比如a.c，能匹配abc也能a&c
- * 匹配0个或多个，ab*c，能匹配ac abc abbbc
- + 匹配1个或多个，ab+c，能匹配abc，abbbc，但不能ac
- ? 匹配0个或1个，ab?c，能匹配ac，abc，但不能abbc
- \d 匹配数字，任意一个
- \D 任意非数字
- \w 匹配字母、数字、下划线
- \W 非单词字母
- \s 匹配空白字符，空格、tab、换行
- \S 非空白字符
- \[...\] 匹配任意一个括号内的
- \[^\] 不在括号内的
- () 分组捕获，比如：(\d{4})-(\d{2})，使用group查看对应组
- ^ 匹配开头 ，比如^Error，匹配Error开头的
- $ 匹配结尾 ，比如Error$,匹配Error结尾的
- {n,m} ， 匹配前一个字符n到m个，比如\d{1,3} 匹配1到3个数字

模块常用的：
- re.search(pattern, string)，匹配字符串，返回第一个匹配项，无匹配则返回None
- re.findall(pattern, string)，返回所有匹配项，无匹配则返回[]
- re.sub(pattern,replace,string)，查找且替换
- re.match(pattern,string)，从字符串开头匹配，若开头不匹配，直接返回None
- pattern = re.compile(pattern)，如果多次用到这个表达式，可以先编译成对象，提高效率
```python
import re

text = "Hello World"
match1 = re.match(r'Hello', text) # 成功
match2 = re.match(r'World', text) # 失败，因为'World'不在开头

print(match1) # -> <re.Match object; span=(0, 5), match='Hello'>
print(match2) # -> None
```
带个例子，不然不明显


比如做一个敏感日志提取
```python
import re

log_data = """
2025-07-22 INFO: User 'admin' logged in from 192.168.1.100.
2025-07-22 ERROR: Failed to connect to server at 192.168.1.52. Contact admin@example.com.
2025-07-22 INFO: User 'guest' made a transaction.
2025-07-22 WARNING: Disk space is low. 25GB available.
Email support at admin@admin.com for assistance.
"""

ip_parttern = r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
found_ips = re.findall(ip_parttern, log_data)
print(found_ips)

email_pattern = r"\w+@\w+\.\w+"
found_emails = re.findall(email_pattern, log_data)
print(found_emails)

err_line = r"^.*ERROR:.*$"
found_err_lines = re.findall(err_line, log_data, re.MULTILINE)
print(found_err_lines)
```

### 13、socket
理解socket可以明白网络数据传输的本质

socket套接字，网络中进行数据通信的端点，就像一手机，两电脑想通信，就给各自需要一个socket

为了让通话成功，你得有ip，就像住酒店，你知道了对方的地址，还有知道port，端口分机号，比如找到酒店，给前台说转888号

socket有TCP和UDP两种

一个程序想要网络通讯，必须先创建一个socket，socket绑定了本地的一个端口，并可以链接到远程服务器的ip和端口

分服务端和客户端

TCP Socket的流程：
Server：
- 创建一个Socket
- 绑定到一个ip和端口，通过bind
- 监听，通过listen
- 接受连接，通过accept
- 关闭socket，通过close
- 销毁socket，通过destroy

Client：
- 创建一个Socket
- 向服务器发送请求，通过connect

Data：
- 接收数据，通过recv
- 发送数据，通过send

服务器写法：
```python
import socket

# 1. 创建 socket 对象
# AF_INET 表示使用 IPv4 协议
# SOCK_STREAM 表示使用 TCP 协议
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2. 绑定地址和端口
host = "127.0.0.1"  # 监听本机
port = 9999
server_socket.bind((host, port))

# 3. 开始监听，5 表示最多允许5个客户端排队等待连接
server_socket.listen(5)
print(f"服务器正在 {host}:{port} 上监听...")

# 4. 接受客户端连接
# accept() 会阻塞程序，直到有客户端连接
# 它返回一个新的 socket 对象 (conn) 和客户端的地址 (addr)
conn, addr = server_socket.accept()
print(f"接受到来自 {addr} 的连接")

try:
    while True:
        # 5. 接收数据
        # 1024 是缓冲区大小，表示一次最多接收 1024 字节
        data = conn.recv(1024)
        if not data:
            # 如果接收到空数据，表示客户端已关闭连接
            print("客户端已断开连接。")
            break

        message = data.decode("utf-8")
        print(f"收到消息: {message}")

        # 6. 发送回执消息
        response = f"已收到你的消息: '{message}'"
        conn.sendall(response.encode("utf-8"))

finally:
    # 7. 关闭连接
    conn.close()
    server_socket.close()
    print("服务器已关闭。")

```
客户端写法
```python
import socket

# 1. 创建 socket 对象
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 服务器地址和端口
host = "127.0.0.1"
port = 9999

try:
    # 2. 连接服务器
    client_socket.connect((host, port))
    print(f"已成功连接到服务器 {host}:{port}")

    # 3. 发送数据
    message_to_send = "你好，服务器！"
    client_socket.sendall(message_to_send.encode("utf-8"))
    print(f"已发送消息: {message_to_send}")

    # 4. 接收服务器的回应
    data = client_socket.recv(1024)
    print(f"收到服务器回应: {data.decode('utf-8')}")

finally:
    # 5. 关闭连接
    client_socket.close()
    print("已与服务器断开连接。")
```

### 14、struct
发送数据，或者把数据保存到一个二进制文件，都需要原始的字节，所以struct就是一个打包解包工具
想一想，在一个网络游戏里，一个角色的数据包，是什么样子？
和我们一样，名字、id、坐标、血量等一次次的发？
绝对不是的，他们发送是有结构的，就想：
- 1-4个字节是玩家的id，整数
- 5-8个字节是x坐标，浮点
- 9-12个字节是y坐标，浮点
- 13-16个字节是血量，字节或其他类型
- ...
我们从网上收到了一串内容：b'\x01\x00\x00\x00\x00\x00\x28\x41...'
如何翻译回本来的样子？手动撸吗？

struct了解下
- pack，把数据打包成二进制数据
- unpack，把二进制数据解包成数据
- calcsize,计算大小

字节序：
- < - little endian，小端序，绝大数win和intel/amd处理器都是小端序，低位存低位地址，高位存高位
- \> or ! - big endian，大端序，arm处理器都是大端序，高位存低位，低位存高位
- @ - 本地字节序，默认的
- ! - 网络字节序，等同大端序

别迷糊，比如0x12345678，这个数在计算机中存储时，会变成0x78 0x56 0x34 0x12，大端就是正常的 0x12 0x34 0x56 0x78

常用的格式字符：
- c - char - bytes - 1字节
- b - signed char - 1字节
- B - unsigned char - 1字节
- ? - Bool - 1字节
- h - short - 2字节
- H - unsigned short - 2字节
- i - int - 4字节
- I - unsigned int - 4字节
- l - long - 4字节
- L - unsigned long - 4字节
- q - long long - 8字节
- Q - unsigned long long - 8字节
上面这些在Python中不是integer，上面写的c语言的数据类型
- f - float - 4字节
- d - double - 8字节
- s - char[] - 字符串，字符串长度由后面的数字决定
- p - char[]
- x - 填充的
Python的f和d都是float s为bytes

代码如下：
```python
import struct

# 1. 原始数据
packet_id = 101
player_x = 10.5
player_y = -3.75
player_health = 85

# 2. 格式化字符串
# < : 小端序
# I : 4字节的无符号整数 (用于packet_id)
# f : 4字节的浮点数 (用于player_x)
# f : 4字节的浮点数 (用于player_y)
# B : 1字节的无符号字符 (0-255)
packet_format = "<IffB"

# 3. 打包数据
packed_data = struct.pack(packet_format, packet_id, player_x, player_y, player_health)

print("--- 客户端发送 ---")
print(f"原始数据: ID={packet_id}, X={player_x}, Y={player_y}, Health={player_health}")
print(f"打包后的二进制数据: {packed_data}")
print(f"数据包总长度: {len(packed_data)} 字节")  # 4 + 4 + 4 + 1 = 13 字节
print("-" * 10)



# 1. 解包数据
unpacked_data_tuple = struct.unpack(packet_format, packed_data)

# 2. 解包后的数据是一个元组
print("--- 服务器接收 ---")
print(f"解包后的元组: {unpacked_data_tuple}")

# 3. 从元组中恢复原始数据
recv_id = unpacked_data_tuple[0]
recv_x = unpacked_data_tuple[1]
recv_y = unpacked_data_tuple[2]
recv_health = unpacked_data_tuple[3]

print(f"成功恢复数据: ID={recv_id}, X={recv_x}, Y={recv_y}, Health={recv_health}")
```
上面的4x表示跳过4字节，不做任何解析


### 15、综合利用
解析简单的bmp文件
bmp的文件头结构基本如下：
- 偏移0 2字节 文件前面，必须是BM
- 偏移2 4字节 文件的大小
- 偏移6 4字节 保留字段
- 偏移10 4字节 像素数据起始的偏移
  
信息头：
- 偏移14 4字节 信息头的大小
- 偏移18 4字节 图像的宽度
- 偏移22 4字节 图像的高度

解析文件头的14字节，格式化字符就是:`<2sI4xI`，2字节字符串和4字节跳过和4字节无符号整数

解析信息头的12字节，`<Iii`，4字节无符号，4字节有符号，4字节有符号

```python
import struct
import sys


def parse_bmp(filename):
    try:
        with open(filename, "rb") as f:  # 'rb' -> 以二进制模式读取
            # --- 1. 解析文件头 (14字节) ---
            # 比如：42 4D DA 55 00 00 00 00 00 00 36 00 00 00
            file_header_format = "<2sI4xI"
            file_header_size = struct.calcsize(file_header_format) # calcsize() 函数返回格式的字节数
            file_header_data = f.read(file_header_size) # 读取指定数量的字节

            # 解包！
            file_header = struct.unpack(file_header_format, file_header_data) # 解包，参数1为格式字符串，参数2为数据

            signature = file_header[0] # 文件签名，42 4D = BM
            file_size = file_header[1] # 文件大小，55 DA = 21978
            pixel_data_offset = file_header[2] # 像素数据偏移 36=54

            # 验证文件签名
            if signature != b"BM":
                print("错误: 这不是一个有效的BMP文件。")
                return

            print("\n[+] 文件头 (BITMAPFILEHEADER):")
            print(f"  签名: {signature}")
            print(f"  文件大小: {file_size} 字节")
            print(f"  像素数据偏移: {pixel_data_offset}")


            # --- 2. 解析信息头 (DIB Header) 的关键部分 ---
            # 文件指针现在位于第14字节处
            # 后面12字节：28 00 00 00 54 00 00 00 57 00 00 00
            dib_header_format = "<Iii"  # 我们只关心前12字节：大小、宽度、高度
            dib_header_size = struct.calcsize(dib_header_format) # calcsize() 函数返回格式的字节数
            dib_header_data = f.read(dib_header_size) # 读取指定数量字节

            dib_header = struct.unpack(dib_header_format, dib_header_data)

            header_size = dib_header[0] # 28 = 40
            width = dib_header[1] # 54 = 84
            height = dib_header[2] # 57 = 87

            print("\n[+] 信息头 (BITMAPINFOHEADER):")
            print(f"  头部大小: {header_size}")
            print(f"  图像宽度: {width} 像素")
            print(f"  图像高度: {height} 像素")

    except FileNotFoundError:
        print(f"错误: 文件 '{filename}' 未找到。")
    except struct.error:
        print("错误: 文件太小或已损坏，无法解析。")


# --- 主程序逻辑 ---
if len(sys.argv) < 2:
    print("用法: python bmp_parser.py <文件名.bmp>")
else:
    parse_bmp(sys.argv[1])
```

### 16、hashlib
哈希：单向的数学运算，可以把任意长度的数据转化为一个固定长度的字符串，这个输出就是哈希值/摘要，有三个特性：
- 确定性：同样的数据输入，会产生完全相同的输出
- 单向性：从原始数据到指纹可以，但是反推原始数据不行
- 雪崩效应：只要原始数据发生一个很微小的变化，指纹也会不同

常常用来保存密码防止明文泄露，文件传输的教研，防止下载过程损坏或者被植入恶意木马，在存储和数据系统进行去重，因为一样的话haash肯定是相同的

常见的：
- md5
- sha1
- sha256

基本就是导入hashlib开始耍
- .update()，提供要计算的数据
- .hexdigest()，获取哈希值
sha256、sha512、sha3_256等是安全的，md5和sha1已经不推荐使用了

```python
import hashlib

text1 = "hello world"
text2 = "hello worlD"

sha256_hasher = hashlib.sha256()

# 哈希函数只接受字节(bytes)作为输入
sha256_hasher.update(text1.encode("utf-8"))

hash1 = sha256_hasher.hexdigest()

print(f"'{text1}' 的SHA256哈希值是: {hash1}")

# 验证雪崩效应
sha256_hasher_2 = hashlib.sha256()
sha256_hasher_2.update(text2.encode("utf-8"))
hash2 = sha256_hasher_2.hexdigest()

print(f"'{text2}' 的SHA256哈希值是: {hash2}")
```
如上，只有一个字母不同，产生的hash完全不同

```python
import hashlib


def calculate_file_hash(filename, algorithm="sha256"):
    """计算文件的哈希值"""
    hasher = hashlib.new(algorithm)

    try:
        with open(filename, "rb") as f:
            while chunk := f.read(4096): # 每次读取4KB数据
                hasher.update(chunk) # 更新哈希值
        return hasher.hexdigest() # 返回哈希值
    except FileNotFoundError:
        return f"错误: 文件 '{filename}' 未找到。"


bmp_file = "21.bmp"
bmp_hash = calculate_file_hash(bmp_file)
print(f"\n文件 '{bmp_file}' 的SHA256哈希值是: {bmp_hash}")
```
读取文件生成hash，尝试把路径改为calc.exe，然后改为md5，生成后拿着去virustotal搜索一下，这就是指纹，这就是大文件的获取方式

往往一次hash不安全，可以使用彩虹表进行查询，也可以加盐提高安全性

### 17、requests
处理http请求，`pip install requests`，先安装

- requests.get(url)
- requests.get(url, params)
- requests.post(url, data)

发送请求得到响应对象
- .status_code 状态码
- .text 响应内容
- .json() 响应内容，json格式
- .cookies 响应的cookie
- .headers 响应头
- .content 响应内容，字节流

```python
import sys

import requests


def get_github_user_info(username):
    """查询指定GitHub用户的信息。"""
    # 1. 构造API的URL
    url = f"https://api.github.com/users/{username}"
    print(f"正在查询: {url}")

    try:
        # 2. 发送GET请求
        response = requests.get(url)

        # 3. 检查响应状态码
        if response.status_code == 200:
            # 4. 如果成功，解析JSON数据
            data = response.json()

            # 5. 打印我们关心的情报
            print("\n--- GitHub User Info ---")
            print(f"  Name: {data['name']}")
            print(f"  Company: {data['company']}")
            print(f"  Location: {data['location']}")
            print(f"  Public Repos: {data['public_repos']}")
            print(f"  Followers: {data['followers']}")
            print("------------------------")

        elif response.status_code == 404:
            print("错误: 找不到该用户。")
        else:
            print(f"发生错误: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"网络请求错误: {e}")


# --- 主程序逻辑 ---
if len(sys.argv) > 1:
    target_user = sys.argv[1]
    get_github_user_info(target_user)
else:
    print("未提供用户名，查询默认用户 'gvanrossum'...")
    get_github_user_info("gvanrossum")
```

还可以设置请求投，通过字典设置，然后headers参数带入
timeout的超时设置

包括对同一个网站多次通讯，先登录才看其他页面，使用requests.Session对象来访问，自动保持

### 18、pillow
pillow围绕一个Image的对象，用Pillow打开一个图片，得到的就是一个Image对象。
常用的属性方法：
- Image.open() 打开图片
- .format() 获取图片格式
- .size() 获取图片尺寸
- .mode() 获取图片模式
- .show() 显示图片
- .resize() 重新设置图片尺寸
- .convert() 转换图片模式
- .save() 保存图片
- .crop()，裁剪
- .thumbnail()，生成缩略图，并且保持长宽比，直接原地修改

pillow也要安装 `pip install Pillow`

```python
from PIL import Image

try:
    img = Image.open("sample.jpg")

    print("--- 原始图片信息 ---")
    print(f"格式: {img.format}")
    print(f"尺寸: {img.size}")
    print(f"色彩模式: {img.mode}")

    # 3. 快速预览一下图片
    # img.show() # 在调试时可以取消这行注释来查看图片

    # 4. 将图片转换为灰度图
    print("\n正在生成灰度版本...")
    grayscale_img = img.convert("L")
    grayscale_img.save("sample_grayscale.png")  # 保存为png格式
    print("灰度图片已保存为 sample_grayscale.png")

    # 5. 生成一个128x128的缩略图
    print("\n正在生成缩略图...")
    #原地修改图片，并保持长宽比
    img.thumbnail((128, 128))
    img.save("sample_thumbnail.jpg")
    print("缩略图已保存为 sample_thumbnail.jpg")

except FileNotFoundError:
    print("错误: sample.jpg 未找到！请确保图片和脚本在同一个文件夹下。")
except Exception as e:
    print(f"发生未知错误: {e}")
```

### 19、PyCryptodome
一个三方库，加密解密用
也要安装:`pip install pycryptodome`

加密、解密、密钥就不说了，很简单
- 对称加密:加密和解密使用同一个密钥 AES
- 非对称加密:加密和解密使用不同的密钥，公钥和私钥
还有其他的库可以操作，可以自己摸索

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# --- 1. 准备工作 ---
# AES-128使用16字节(128位)的密钥
key = get_random_bytes(16)
data = b"This is the secret message for our RE course!"

# --- 2. 加密过程 ---
# 创建AES加密器，使用EAX模式
cipher = AES.new(key, AES.MODE_EAX)
nonce = cipher.nonce  # 随机数，每次加密都不同
ciphertext, tag = cipher.encrypt_and_digest(data)

print("--- 加密完成 ---")
print(f"密钥 (key): {key.hex()}")
print(f"nonce: {nonce.hex()}")
print(f"tag认证标签: {tag.hex()}")
print(f"加密后的密文 (hex): {ciphertext.hex()}\n")

# --- 3. 解密过程 ---
decipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
try:
    decrypted = decipher.decrypt_and_verify(ciphertext, tag)
    # .decrypt_and_verify 会检查认证标签，若数据或者标签被篡改，会异常
    print("--- 解密完成 ---")
    print(f"解密后的数据: {decrypted.decode('utf-8')}")
except ValueError:
    print("解密失败")

# 4. 验证
assert data == decrypted
print("\n[+] 验证成功！原始数据与解密后的数据完全一致。")
```

### 20、分析测试
将前面的内容汇总，书写一个简单的分析工具

比如收到n个样本，先通过工具分析一下，初步了解再去深度逆向

我需要实现：
- 输入：脚本可以输入一个文件路径为命令行参数
- 信息：显示基本的文件名、路径、大小
- 指纹：计算显示md5 sha1 sha256哈希值
- 提取：提取文件里的ASCII字符串
- 匹配：提取出的字符串里，用正则表达式寻找信息，比如url、ip、dll名称等
- 识别：检查文件头，判断文件类型
- 输出：控制台打印清晰的分析报告

```python
import hashlib
import os
import re
import sys


def analyzer_basic_info(filepath):
    """分析文件的基本信息。"""
    pass

def calc_hash(filepath):
    """计算文件的哈希值。"""
    pass

def extract_strings(filepath):
    """提取文件中的字符串。"""
    pass

def main():
    print("="*10 + "分析报告" + "="*10)

    if len(sys.argv) < 2:
        print("请提供要分析的文件路径,python analyzer.py <filepath>")
        sys.exit(1)
    
    target_file = sys.argv[1]

    if not os.path.exists(target_file):
        print(f"文件 '{target_file}' 不存在")
        sys.exit(1)
    
    analyzer_basic_info(target_file)
    calc_hash(target_file)
    extract_strings(target_file)

    print("=" * 10 + "分析结束" + "=" * 10)

if __name__ == "__main__":
    main()
```
首先构建基本框架，这里有个name==main，意思是当脚本直接运行的时候，name=main，如果被当作模块的时候，name=文件名

```python
locale.setlocale(locale.LC_TIME, "zh_CN.UTF-8")
def analyzer_basic_info(filepath):
    print("-"*10 + "基本信息" + "-"*10)
    try:
        file_size = os.path.getsize(filepath)
        abs_path = os.path.abspath(filepath)
        getmtime = time.strftime('%Y年%m月%d日 %A %H:%M:%S', time.localtime(os.path.getmtime(filepath)))
        print(f"文件路径: {abs_path}")
        print(f"文件大小: {file_size} 字节 - {file_size / 1024} KB - {file_size / 1024 / 1024} MB")
        print(f"修改时间：{getmtime}")
    except Exception as e:
        print(f"错误: {e}")
        return
```
实现基础信息的获取

hash提取
```python
def calc_hash(filepath):
    print("-" * 10 + "哈希信息" + "-" * 10)
    try:
        with open(filepath, "rb") as f:
            file_bytes = f.read() # 一次性读取

            md5 = hashlib.md5(file_bytes).hexdigest()
            sha1 = hashlib.sha1(file_bytes).hexdigest()
            sha256 = hashlib.sha256(file_bytes).hexdigest()

            print(f"MD5: {md5}")
            print(f"SHA1: {sha1}")
            print(f"SHA256: {sha256}")
    except Exception as e:
        print(f"错误: {e}")
        return
```

字符串提取
```python
def extract_strings(filepath):
    print("-" * 10 + "可打印字符串" + "-" * 10)
    try:
        with open(filepath, "rb") as f:
            result = ""
            file_bytes = f.read()

        for char_code in file_bytes:
            char = chr(char_code) # chr把数字转为字符
            # 判断字符是否可打印
            if char in string.printable: # 如果是可显示字符
                result += char # 加到result里
            else:
                if len(result) > 4: # 否则就判断当前result长度是否大于4
                    yield result # 如果当前长度大于4，就yield返回内容
                result = "" # 清空result
        if len(result) >= 4:
            yield result
    except Exception as e:
        print(f"错误: {e}")
        return

def main():
    print("="*10 + "分析报告" + "="*10)

    if len(sys.argv) < 2:
        print("请提供要分析的文件路径,python analyzer.py <filepath>")
        sys.exit(1)
    
    target_file = sys.argv[1]

    if not os.path.exists(target_file):
        print(f"文件 '{target_file}' 不存在")
        sys.exit(1)
    
    analyzer_basic_info(target_file)
    calc_hash(target_file)

    all_strings = list(extract_strings(target_file)) # 拿到字符列表

    if all_strings:
        print(f"  共提取到 {len(all_strings)} 个字符串。")

        ip_pattern = rb"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
        url_pattern = rb"https?://[^\s/$.?#].[^\s]*"
        suspicious_apis = [b"CreateRemoteThread", b"WriteProcessMemory", b"HttpSendRequest"]

        found_ips = set() # 去重
        found_urls = set()
        found_apis = set()

        all_strings_bytes = "\n".join(all_strings).encode(errors="ignore") # 用换行链接起来，且编码成字节，如果遇到无法编码的，比如emoji标签等，不要报错，继续往下执行

        for ip in re.findall(ip_pattern, all_strings_bytes): # 开始匹配是否存在
            found_ips.add(ip.decode(errors='ignore'))

        for url in re.findall(url_pattern, all_strings_bytes):
            found_urls.add(url.decode(errors='ignore'))

        for s in all_strings: # 这个先遍历字符内容
            for api in suspicious_apis: # 遍历我们的名单列表
                if api in s.encode(): # 如果名单列表存在于字符内容里
                    found_apis.add(api.decode()) # 添加

        if found_ips or found_urls or found_apis: # 如果有数据
            print("\n--- [可疑情报分析] ---")
            if found_ips:
                print(f"  [!] 发现疑似IP地址: {list(found_ips)}")
            if found_urls:
                print(f"  [!] 发现疑似URL: {list(found_urls)}")
            if found_apis:
                print(f"  [!] 发现可疑API调用: {list(found_apis)}")

    print("=" * 10 + "分析结束" + "=" * 10)

if __name__ == "__main__":
    main()
```



### 21、多线程 / 多进程 / 异步
多线程，适合I/O密集任务，比如网络请求，文件读写，因为等待IO的时候，CPU空闲，这时候可以利用起来，提高效率
多进程，适合CPU密集任务，比如数学计算，大规模数据处理，利用多核CPU让多个进程并行
异步，处理超高并发IO的方案

#### 多线程
说白了，比如我做饭的时候，现在炖着牛肉，也就相当于现在已经在下载文件和文件读取了
此时我是没事干的，我可以在这个过程里，去准备下一个菜的东西，或者去玩会电脑，等我忙的差不多了，这个牛肉炖好了

但是因为Python的GIL，一个进程内的多个线程只有一个线程能真的执行Python的代码
```python
import threading
import time


def download(url):
    print(f"开始下载: {url}")
    time.sleep(2)  # 模拟下载耗时2秒
    print(f"下载完成: {url}")


urls = ["http://site1.com", "http://site2.com", "http://site3.com"]

start_time = time.time()

# --- 顺序执行 ---
# for url in urls:
#     download(url) # 总耗时约 6 秒

# # --- 多线程执行 ---
threads = []
for url in urls:
    thread = threading.Thread(target=download, args=(url,)) # 创建线程，执行download，参数url
    threads.append(thread) # 添加到列表
    thread.start()  # 启动线程，会启动三个

for thread in threads: # 循环列表
    thread.join()  # 等待所有线程执行完毕

end_time = time.time()
print(f"多线程总耗时: {end_time - start_time:.2f} 秒")  # 总耗时约 2 秒
```


线程是给进程干活的，还可以有多进程


```python
import multiprocessing
import time


def cpu_heavy_task(n):
    print(f"开始计算: {n}")
    count = 0
    for i in range(10**7):  # 执行一个耗时的循环
        count += i
    print(f"计算完成: {n**7}")
    return count


if __name__ == "__main__":
    start_time = time.time()

    # 使用进程池，让CPU的多个核心一起工作
    with multiprocessing.Pool(processes=3) as pool:
        pool.map(cpu_heavy_task, [1, 2, 3])

    end_time = time.time()
    print(f"多进程总耗时: {end_time - start_time:.2f} 秒")
```
1的7次方=1,2的7次方=128,3的7次方=2187


异步，不停的切换，比如我今天报单了，看一眼订单1，按下原料开关，去看订单2，按下机器开关，去看订单3，操作机器
一会，订单1的完成信号出来了，我立刻回到订单1，进行下一步工作，也就是一直不停的在做可以立即完成的工作
- asyncio 使用一个事件循环来调度一系列的协程
  - async def，定义函数为协程
  - await,当一个协程执行到await某个耗时操作，暂停自己，控制权给事件循环，事件循环去执行其他准备就绪的协程
```python

import asyncio
import time


async def download_async(url):
    print(f"开始下载: {url}")
    await asyncio.sleep(2)  # 模拟异步的网络I/O操作
    print(f"下载完成: {url}")


async def main():
    start_time = time.time()

    # 使用 asyncio.gather() 并发运行多个协程
    await asyncio.gather(
        download_async("http://site1.com"),
        download_async("http://site2.com"),
        download_async("http://site3.com"),
    )

    end_time = time.time()
    print(f"异步I/O总耗时: {end_time - start_time:.2f} 秒")  # 总耗时约 2 秒


# 运行 asyncio 程序
asyncio.run(main())
```


### 22、后续
至于其他的内容，比如：
- 数据的持久化，csv、xml、数据库、表格等操作
- PyQT界面等
- ctypes和C交互
其他没说到的内容，以后用到什么学什么，这里就带一个大概，掌握基础的，只要能上手用代码处理些日常小问题，不生疏，不是说看到这东西看到代码都不知道什么意思即可

所有内容均为个人认知，不保证完全准确，若有错误，欢迎指出
有些时候，往往需要借助Python等来写一些脚本辅助我们来完成工作，所以基础的Python过一下

## Python

安装Python什么的和Visual Studio的方法百度太多了，不说了
和C语言的区别就是代码量少，C语言是编译型的，先把代码全部完整翻译成机器语言，才能运行，Python是解释型的，写一行就翻译一句执行一句这吊样

### 变量
变量：贴标签的盒子，比如我把打火机放到一个盒子里，贴标放松用品，这个贴了标签的盒子就是变量，盒子里的是值，标签是变量名，=是赋值，my_ddlong = 20

Python是一个动态类型的，无需告诉str、int等，会自动识别

最常见的类型：
- 数字
	- int：10、-5、0
    - float：3.14、-0.5
- 字符串str：单引号和双引号括起来的
```python
great_str = "hello"
g2str = "world"

print(great_str + g2str)
print(great_str[1]) # 切片
print(f'{great_str} {g2str}') # 格式化
```

### 容器
如果存储一组数据，就要用容器，列表、元组、字典、集合

列表List 随时可以修改，有序、可存放任何类型、可变，[]表示，逗号分隔元素
```python
re_tools = ["IDA Pro", "x64dbg", "Ghidra", "Wireshark"]
```
访问可以用索引，比如re_tools[0]，甚至加上=去修改，或者
- re.tools.append尾部添加
- insert(index,value)插入
- pop最后一个/remove匹配项删除
- len获取长度

元组Tuple，不可变，就是一个不可变的列表()表示，其他一样


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

# 修改就按上面的赋值

user_profile["other"] = "Cutter" # 添加
del xxx[] # 删除

for key,value in user_profile.items():
		print(f"key:{key},value:{value}")
```


set集合，无序不可重复，没有key的字典
```python
file_extensions = {".exe", ".dll", ".txt", ".exe", ".sys"}
print(file_extensions)
```
用来去重、in成员检测等

### 流程控制
- if 如果，最基本的
```python
if file_size > 1000:
		print("台大了")
```
- if else，多一个分支，不成立的
- if elif else，多个判断分支


循环：
- for 遍历
```python
re_tools = ["IDA Pro", "x64dbg", "Ghidra"]

# tool这个变量，会依次等于列表中的每一个元素
for tool in re_tools:
    print(f"正在分析工具: {tool}")

# range()指定次数的循环
for i in range(5): # range(5) 会生成 0, 1, 2, 3, 4
    print(f"第 {i+1} 次循环。")
```
- while
```python
countdown = 5
while countdown > 0:
    print(countdown)
    countdown = countdown - 1 # 必须改变条件，否则无限循环
print("发射！")
```


### 函数
为了完成某个工作，防止每次都重复性操作，专门复用的
def 定义函数
```python
def get(name):
		message = f"你好, {name}! 欢迎来到函数的世界。"
        return message
zhangsan = greet("张三")
```
函数有作用域，比如message，只能函数内有效，你在工厂是个官，出来工厂就普通人
全局的就是定义在函数外的，函数可以读取全局变量，但尽量不要函数内修改

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



### 导入
现在我们已经可以把逻辑都封斋干到一个函数里了，但是若我们有成千上万的函数，一个用于检查，一个用于分析，一个用于解析，都在一个py里，变得难以维护
我们就可以把这个做成一个工具，用到拿过来直接用，就是模块

模块就是一个py文件，文件里可以写任何函数、类、变量

包，则是装着多个模块的文件夹，要让Python识别包，需要__init__.py文件

import就是从模块里拿出函数，比如import module，导入整个模块

from module import func，从模块里拿出某个函数

Python自带的标准库也足以我们使用
- os，和系统交互
- sys，和Python解释器交互
- re，正则匹配
- struct，二进制数据解析
- socket，网络编程
random等等

### 文件I/O
文件交互和我们正常编辑一样。需要打开-读写-关闭
为了防止忘记关闭，可以使用with语法
```python
with open("file_name",'mode') as f:
    f.write("text")
    f.read()
    pass
```
做个演示
- r 只读
- w 写入
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

### 异常
程序永远无法成为完美的理想状态，终究可能因为某些事情产生崩溃

异常：程序在执行的时候，发生了意外

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
```
如上，比如觉得读取一个文件会出错，那么我给他try一下
还有else和finally，else是可选的，里面的代码会在try没有发生任何异常的情况下执行
finally无论如何都会执行，可以自己动手加上这两个试一试

### 列表推导式和生成器
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

生成器，更懒惰，推导式会在内存里立刻创建出一个完整的新列表，如果处理一个包含很大的列表，消耗的内存很大，生成器可以解决

推导式 = 要求1000个，就立马弄1000个
生成器 = 要求1000个，但一个都不搞，你用了，他给你你要的对应的

```python
my_generator = (i for i in range(10000000))
```
方括号变圆括号即可

返回的是一个生成器对象，可迭代，用for循环遍历也没问题
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

### lambda和高阶函数
def定义的函数，都有函数名，让我们反复使用

但是有时候，我们需要一个功能特简单，且只用一次的临时的，可以用lambda，创建匿名临时的函数

lambda 参数:表达式

```python
lambda x: x + 5
```

高阶函数，可以接收其他的函数作为参数，或者把函数作为返回值
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

### 面向对象
目前来说，所有学习的一切都零零散散，数据一个，输出一个，当程序变大，数据和操作分离的方法很难操控

很经典的比喻就是类 Class 就是一个饼干模具，对象 Obj 就是真正的饼干
```python
class File:
    def __init__(self,filename,filesize):
        self.name = filename
        self.size = filesize
        print(f"{self.name}创建了")
    
    def display_info(self):
        print(f"文件名称{self.name}")
        print(f"文件大小{self.size}")
```
- \_\_init\_\_(self)，构造函数，初始化
- self，代表对象本身，当display_info方法被调用，self 就指向那个调用它的具体的实例
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
- _下划线开头的，比如self._name，说明这是一个内部属性，不要外部调用
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

### os/sys
- os.getcwd()，获取当前工作目录
- os.listdir(path)，列出指定目录下的所有文件和目录
- os.mkdir(path)，创建目录
- os.remove(path)，删除文件
- os.path.join(path1, path2)，拼接路径
- os.path.exists(path)，判断路径是否存在
- os.path.isfile(path)，判断路径是否为文件
- os.system(command)，执行命令

os和系统交互,sys和python交互
- sys.argv，命令行参数列表

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


### re
正则表达式，就是一个超级的查找工具，比如：找出所有a开头的，所有符合电话规则的，所有符合邮箱规则的

核心的字符：
- . 任意字符，除了换行符，比如a.c，能匹配abc也能a&c
- * 匹配0个或多个，ab*c，能匹配ac abc abbbc
- + 匹配1个或多个，ab+c，能匹配abc，abbbc，但不能ac
- ? 匹配0个或1个，ab?c，能匹配ac，abc，但不能abbc
- \d 匹配数字，任意一个
- \w 匹配字母、数字、下划线
- \s 匹配空白字符，空格、tab、换行
- \[...\] 匹配任意一个括号内的
- ^ 匹配开头 ，比如^Error，匹配Error开头的
- $ 匹配结尾 ，比如Error$,匹配Error结尾的
- {n,m} ， 匹配前一个字符n到m个，比如\d{1,3} 匹配1到3个数字

模块常用的：
- re.search(pattern, string)，匹配字符串，返回第一个匹配项，无匹配则返回None
- re.findall(pattern, string)，返回所有匹配项，无匹配则返回[]

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

### socket
前面说过ip和port，相当于地址和房间号，socket就是为了能通话，安装的那个电话插口

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

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# AF_INET: IPv4
# SOCK_STREAM: TCP

host = socket.gethostname()
port = 12345
server_socket.bind((host, port))

server_socket.listen(5) # 监听5个连接
print(f"Server listening on {host}:{port}")

while True:
    client_socket,addr = server_socket.accept() # 接受客户端连接
    print(f"Connected to {addr}")

    mess = "Hello, World!"
    client_socket.send(mess.encode('utf-8')) # 发送消息给客户端

    client_socket.close()
```
客户端写法
```python
import socket

client_socket =  socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = socket.gethostname()
port = 12345

try:
    client_socket.connect((host, port))
    resp = client_socket.recv(1024) # 接收服务器发送的消息,1024是缓冲区大小
    print(f"Received: {resp.decode('utf-8')}")
except socket.error as e:
    print(str(e))

```

### struct
网络传输，不止是文本，还有结构化的二进制数据，前面我们发送的就是一个简单的字符串
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

字节序：
- < - little endian，小端序，绝大数win和intel/amd处理器都是小端序，低位存低位地址，高位存高位
- \> or ! - big endian，大端序，arm处理器都是大端序，高位存低位，低位存高位

别迷糊，比如0x12345678，这个数在计算机中存储时，会变成0x78 0x56 0x34 0x12，大端就是正常的 0x12 0x34 0x56 0x78

常用的格式字符：
- B - unsigned char - 1字节
- h - short - 2字节
- H - unsigned short - 2字节
- i - int - 4字节
- I - unsigned int - 4字节
- q - long long - 8字节
- Q - unsigned long long - 8字节
上面这些在Python中不是integer，上面写的c语言的数据类型
- f - float - 4字节
- d - double - 8字节
- s - char[] - 字符串，字符串长度由后面的数字决定
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

### 综合利用
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


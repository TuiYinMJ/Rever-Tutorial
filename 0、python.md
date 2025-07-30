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
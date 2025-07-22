import hashlib


def calculate_file_hash(filename, algorithm="md5"):
    """计算文件的哈希值"""
    hasher = hashlib.new(algorithm)

    try:
        with open(filename, "rb") as f:
            while chunk := f.read(4096): # 每次读取4KB数据
                hasher.update(chunk) # 更新哈希值
        return hasher.hexdigest() # 返回哈希值
    except FileNotFoundError:
        return f"错误: 文件 '{filename}' 未找到。"


bmp_file = "C:\\Windows\\System32\\calc.exe"
bmp_hash = calculate_file_hash(bmp_file)
print(f"\n文件 '{bmp_file}' 的md5哈希值是: {bmp_hash}")

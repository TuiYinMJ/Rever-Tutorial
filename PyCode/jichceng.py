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
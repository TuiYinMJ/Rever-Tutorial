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

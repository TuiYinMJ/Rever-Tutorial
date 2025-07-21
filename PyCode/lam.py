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
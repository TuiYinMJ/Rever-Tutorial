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

class File:
    def __init__(self,filename,filesize):
        self.name = filename
        self.size = filesize
        print(f"{self.name}创建了")
    
    def display_info(self):
        print(f"文件名称{self.name}")
        print(f"文件大小{self.size}")
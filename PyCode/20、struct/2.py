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

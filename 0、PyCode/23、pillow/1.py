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

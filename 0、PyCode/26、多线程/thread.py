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

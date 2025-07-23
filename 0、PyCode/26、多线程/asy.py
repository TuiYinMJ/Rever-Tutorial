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

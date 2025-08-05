import multiprocessing
import time


def cpu_heavy_task(n):
    print(f"开始计算: {n}")
    count = 0
    for i in range(10**7):  # 执行一个耗时的循环
        count += i
    print(f"计算完成: {n**7}")
    return count


if __name__ == "__main__":
    start_time = time.time()

    # 使用进程池，让CPU的多个核心一起工作
    with multiprocessing.Pool(processes=3) as pool:
        pool.map(cpu_heavy_task, [1, 2, 3])

    end_time = time.time()
    print(f"多进程总耗时: {end_time - start_time:.2f} 秒")

import sys

import requests


def get_github_user_info(username):
    """查询指定GitHub用户的信息。"""
    # 1. 构造API的URL
    url = f"https://api.github.com/users/{username}"
    print(f"正在查询: {url}")

    try:
        # 2. 发送GET请求
        response = requests.get(url)

        # 3. 检查响应状态码
        if response.status_code == 200:
            # 4. 如果成功，解析JSON数据
            data = response.json()

            # 5. 打印我们关心的情报
            print("\n--- GitHub User Info ---")
            print(f"  Name: {data['name']}")
            print(f"  Company: {data['company']}")
            print(f"  Location: {data['location']}")
            print(f"  Public Repos: {data['public_repos']}")
            print(f"  Followers: {data['followers']}")
            print("------------------------")

        elif response.status_code == 404:
            print("错误: 找不到该用户。")
        else:
            print(f"发生错误: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"网络请求错误: {e}")


# --- 主程序逻辑 ---
if len(sys.argv) > 1:
    target_user = sys.argv[1]
    get_github_user_info(target_user)
else:
    print("未提供用户名，查询默认用户 'gvanrossum'...")
    get_github_user_info("gvanrossum")

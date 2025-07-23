import socket

# 1. 创建 socket 对象
# AF_INET 表示使用 IPv4 协议
# SOCK_STREAM 表示使用 TCP 协议
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2. 绑定地址和端口
host = "127.0.0.1"  # 监听本机
port = 9999
server_socket.bind((host, port))

# 3. 开始监听，5 表示最多允许5个客户端排队等待连接
server_socket.listen(5)
print(f"服务器正在 {host}:{port} 上监听...")

# 4. 接受客户端连接
# accept() 会阻塞程序，直到有客户端连接
# 它返回一个新的 socket 对象 (conn) 和客户端的地址 (addr)
conn, addr = server_socket.accept()
print(f"接受到来自 {addr} 的连接")

try:
    while True:
        # 5. 接收数据
        # 1024 是缓冲区大小，表示一次最多接收 1024 字节
        data = conn.recv(1024)
        if not data:
            # 如果接收到空数据，表示客户端已关闭连接
            print("客户端已断开连接。")
            break

        message = data.decode("utf-8")
        print(f"收到消息: {message}")

        # 6. 发送回执消息
        response = f"已收到你的消息: '{message}'"
        conn.sendall(response.encode("utf-8"))

finally:
    # 7. 关闭连接
    conn.close()
    server_socket.close()
    print("服务器已关闭。")

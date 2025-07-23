import socket

# 1. 创建 socket 对象
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 服务器地址和端口
host = "127.0.0.1"
port = 9999

try:
    # 2. 连接服务器
    client_socket.connect((host, port))
    print(f"已成功连接到服务器 {host}:{port}")

    # 3. 发送数据
    message_to_send = "你好，服务器！"
    client_socket.sendall(message_to_send.encode("utf-8"))
    print(f"已发送消息: {message_to_send}")

    # 4. 接收服务器的回应
    data = client_socket.recv(1024)
    print(f"收到服务器回应: {data.decode('utf-8')}")

finally:
    # 5. 关闭连接
    client_socket.close()
    print("已与服务器断开连接。")

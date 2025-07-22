import socket

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# AF_INET: IPv4
# SOCK_STREAM: TCP

host = socket.gethostname()
port = 12345
server_socket.bind((host, port))

server_socket.listen(5) # 监听5个连接
print(f"Server listening on {host}:{port}")

while True:
    client_socket,addr = server_socket.accept() # 接受客户端连接
    print(f"Connected to {addr}")

    mess = "Hello, World!"
    client_socket.send(mess.encode('utf-8')) # 发送消息给客户端

    client_socket.close()
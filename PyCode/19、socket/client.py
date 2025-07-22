import socket

client_socket =  socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = socket.gethostname()
port = 12345

try:
    client_socket.connect((host, port))
    resp = client_socket.recv(1024) # 接收服务器发送的消息,1024是缓冲区大小
    print(f"Received: {resp.decode('utf-8')}")
except socket.error as e:
    print(str(e))

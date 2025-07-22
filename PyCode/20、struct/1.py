import struct

# 1. 原始数据
packet_id = 101
player_x = 10.5
player_y = -3.75
player_health = 85

# 2. 格式化字符串
# < : 小端序
# I : 4字节的无符号整数 (用于packet_id)
# f : 4字节的浮点数 (用于player_x)
# f : 4字节的浮点数 (用于player_y)
# B : 1字节的无符号字符 (0-255)
packet_format = "<IffB"

# 3. 打包数据
packed_data = struct.pack(packet_format, packet_id, player_x, player_y, player_health)

print("--- 客户端发送 ---")
print(f"原始数据: ID={packet_id}, X={player_x}, Y={player_y}, Health={player_health}")
print(f"打包后的二进制数据: {packed_data}")
print(f"数据包总长度: {len(packed_data)} 字节")  # 4 + 4 + 4 + 1 = 13 字节
print("-" * 10)



# 1. 解包数据
unpacked_data_tuple = struct.unpack(packet_format, packed_data)

# 2. 解包后的数据是一个元组
print("--- 服务器接收 ---")
print(f"解包后的元组: {unpacked_data_tuple}")

# 3. 从元组中恢复原始数据
recv_id = unpacked_data_tuple[0]
recv_x = unpacked_data_tuple[1]
recv_y = unpacked_data_tuple[2]
recv_health = unpacked_data_tuple[3]

print(f"成功恢复数据: ID={recv_id}, X={recv_x}, Y={recv_y}, Health={recv_health}")

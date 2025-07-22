from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# --- 1. 准备工作 ---
# AES-128使用16字节(128位)的密钥
key = get_random_bytes(16)
data = b"This is the secret message for our RE course!"

print(f"原始密钥 (hex): {key.hex()}")
print(f"原始数据: {data}\n")

# --- 2. 加密过程 ---
# 创建AES加密器，使用CBC模式
cipher = AES.new(key, AES.MODE_CBC)
# CBC模式需要一个初始向量(IV)
iv = cipher.iv
# AES处理的数据必须是16字节的倍数
padded_data = pad(data, AES.block_size)
ciphertext = cipher.encrypt(padded_data)

print("--- 加密完成 ---")
print(f"初始向量 (IV) (hex): {iv.hex()}")
print(f"加密后的密文 (hex): {ciphertext.hex()}\n")

# --- 3. 解密过程 ---
# 使用 key, iv, ciphertext 解密
decipher = AES.new(key, AES.MODE_CBC, iv=iv) # 用相同的key和iv
decrypted_padded_data = decipher.decrypt(ciphertext)
# 解密后，去掉之前填充
decrypted_data = unpad(decrypted_padded_data, AES.block_size)

print("--- 解密完成 ---")
print(f"解密后的数据: {decrypted_data}")

# 4. 验证
assert data == decrypted_data
print("\n[+] 验证成功！原始数据与解密后的数据完全一致。")
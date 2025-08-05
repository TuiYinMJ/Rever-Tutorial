from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# --- 1. 准备工作 ---
# AES-128使用16字节(128位)的密钥
key = get_random_bytes(16)
data = b"This is the secret message for our RE course!"

# --- 2. 加密过程 ---
# 创建AES加密器，使用EAX模式
cipher = AES.new(key, AES.MODE_EAX)
nonce = cipher.nonce  # 随机数，每次加密都不同
ciphertext, tag = cipher.encrypt_and_digest(data)

print("--- 加密完成 ---")
print(f"密钥 (key): {key.hex()}")
print(f"nonce: {nonce.hex()}")
print(f"tag认证标签: {tag.hex()}")
print(f"加密后的密文 (hex): {ciphertext.hex()}\n")

# --- 3. 解密过程 ---
decipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
try:
    decrypted = decipher.decrypt_and_verify(ciphertext, tag)
    # .decrypt_and_verify 会检查认证标签，若数据或者标签被篡改，会异常
    print("--- 解密完成 ---")
    print(f"解密后的数据: {decrypted.decode('utf-8')}")
except ValueError:
    print("解密失败")

# 4. 验证
assert data == decrypted
print("\n[+] 验证成功！原始数据与解密后的数据完全一致。")

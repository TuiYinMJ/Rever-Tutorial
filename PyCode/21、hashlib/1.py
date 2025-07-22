import hashlib

text1 = "hello world"
text2 = "hello worlD"

sha256_hasher = hashlib.sha256()

# 哈希函数只接受字节(bytes)作为输入
sha256_hasher.update(text1.encode("utf-8"))

hash1 = sha256_hasher.hexdigest()

print(f"'{text1}' 的SHA256哈希值是: {hash1}")

# 验证雪崩效应
sha256_hasher_2 = hashlib.sha256()
sha256_hasher_2.update(text2.encode("utf-8"))
hash2 = sha256_hasher_2.hexdigest()

print(f"'{text2}' 的SHA256哈希值是: {hash2}")

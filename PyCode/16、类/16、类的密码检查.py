import string


class Password:
    def __init__(self,password_str):
        # 封装保护属性
        self._password = password_str
        self._score = 0
        self._feedback = []

        # 自我分析
        self._calc_str()

    def _calc_str(self):
        if len(self._password) >= 6:
            self._score += 1
        else:
            self._feedback.append("密码长度不够")
        
        has_upper = any(c.isupper() for c in self._password)
        has_lower = any(c.islower() for c in self._password)
        has_digit = any(c.isdigit() for c in self._password)
        has_special = any(c in string.punctuation for c in self._password)

        if has_upper and has_lower and has_digit and has_special:
            self._score += 4
        else:
            self._feedback.append("密码必须包含大写、小写、数字、特殊字符")
    
    def get_verdict(self):
        if self._score >= 4:
            return "密码强度高"
        else:
            return "密码强度低"
    
    def __str__(self):
        return f"密码: '{"*" * len(self._password)}' | 强度: {self.get_verdict()}"
    
    def __len__(self):
        return len(self._password)
        

test_passwords = ["12345", "abcdefgh", "ABCDEFGH", "Abcdefg1", "StrongP@ss123"]

print("--- 开始进行面向对象的密码分析 ---\n")
for pwd_str in test_passwords:
    pwd_obj = Password(pwd_str)

    # 直接打印对象，会自动调用__str__
    print(pwd_obj)
    # 使用len()，会自动调用__len__
    print(f"  长度: {len(pwd_obj)}")

    # 打印详细的反馈信息
    if pwd_obj._score < 5:
        print(f"  建议: {', '.join(pwd_obj._feedback)}")

    print("-" * 35)
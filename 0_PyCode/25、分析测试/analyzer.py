import hashlib
import json
import locale
import os
import re
import string
import sys
import time

locale.setlocale(locale.LC_TIME, "zh_CN.UTF-8")
def analyzer_basic_info(filepath):
    print("-"*10 + "基本信息" + "-"*10)
    try:
        file_size = os.path.getsize(filepath)
        abs_path = os.path.abspath(filepath)
        getmtime = time.strftime('%Y年%m月%d日 %A %H:%M:%S', time.localtime(os.path.getmtime(filepath)))
        return {
            "absolute_path": abs_path,
            "file_size_bytes": file_size,
            "last_modified": str(getmtime),  # 转换为字符串
        }
    except Exception as e:
        print(f"错误: {e}")
        return

def calc_hash(filepath):
    print("-" * 10 + "哈希信息" + "-" * 10)
    hashs = {}
    try:
        with open(filepath, "rb") as f:
            file_bytes = f.read() # 一次性读取
            hashs["md5"] = hashlib.md5(file_bytes).hexdigest()
            hashs["sha1"] = hashlib.sha1(file_bytes).hexdigest()
            hashs["sha256"] = hashlib.sha256(file_bytes).hexdigest()
    except Exception as e:
        print(f"错误: {e}")
        return
    return hashs

def extract_strings(filepath):
    print("-" * 10 + "可打印字符串" + "-" * 10)
    analysis = {
        "extra_strings_count": 0,
        "first_20_strings": [],
        "intel": {"ips": [], "urls": [], "apis": [], "emails": []},
    }

    try:
        with open(filepath, "rb") as f:
            file_bytes = f.read()
    except Exception as e:
        print(f"错误: {e}")
        return

    printable_chars = bytes(string.printable, "utf-8")
    temp_str = b""
    all_string = []
    for byte in file_bytes:
        if byte in printable_chars:
            temp_str += bytes([byte])
        else:
            if len(temp_str) >= 4:
                all_string.append(temp_str.decode(errors="ignore"))
            temp_str = b""
    if len(temp_str) >= 4:
        all_string.append(temp_str.decode(errors="ignore"))

    analysis["extra_strings_count"] = len(all_string)
    analysis["first_20_strings"] = all_string[:20]

    full_text = "\n".join(all_string)
    ip_pattern = r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    url_pattern = r"https?://[^\s/$.?#].[^\s]*"
    suspicious_apis = [b"CreateRemoteThread", b"WriteProcessMemory", b"HttpSendRequest"]

    analysis["intel"]["ips"] = list(set(re.findall(ip_pattern, full_text)))
    analysis["intel"]["urls"] = list(set(re.findall(url_pattern, full_text)))

    found_apis = set()
    full_text_bytes = full_text.encode("utf-8", errors="ignore")
    for api in suspicious_apis:
        if api in full_text_bytes:
            found_apis.add(api.decode("utf-8"))
    analysis["intel"]["apis"] = list(found_apis)

    return analysis  # 添加 return 语句


def generate_console_report(analysis_results):
    """将分析结果字典，漂亮地打印到控制台。"""
    print("\n" + "=" * 10 + " 初步分析报告 " + "=" * 10)


    print("\n--- [基本信息] ---")
    basic_info = analysis_results.get("basic_info", {})
    if "error" in basic_info:
        print(f"  {basic_info['error']}")
    else:
        print(f"  绝对路径: {basic_info.get('absolute_path', 'N/A')}")
        print(f"  文件大小: {basic_info.get('file_size_bytes', 'N/A')} 字节")
        print(f"  最后修改: {basic_info.get('last_modified', 'N/A')}")

    # 打印哈希
    print("\n--- [文件哈希] ---")
    hashes = analysis_results.get("hashes", {})
    if "error" in hashes:
        print(f"  {hashes['error']}")
    else:
        print(f"  MD5   : {hashes.get('md5', 'N/A')}")
        print(f"  SHA1  : {hashes.get('sha1', 'N/A')}")
        print(f"  SHA256: {hashes.get('sha256', 'N/A')}")

    # 打印字符串和情报分析
    string_info = analysis_results.get("string_analysis", {})
    print(
        f"\n--- [字符串与情报分析 (共提取 {string_info.get('extracted_strings_count', 0)} 个)] ---"
    )
    if "error" in string_info:
        print(f"  {string_info['error']}")
    else:
        intel = string_info.get("intel", {})
        if intel.get("ips"):
            print(f"  [!] 发现疑似IP地址: {intel['ips']}")
        if intel.get("urls"):
            print(f"  [!] 发现疑似URL: {intel['urls']}")
        if intel.get("apis"):
            print(f"  [!] 发现可疑API调用: {intel['apis']}")

        print("\n  [+] 字符串预览 (前20条):")
        for s in string_info.get("first_20_strings", []):
            print(f"    - {s}")

    print("\n" + "=" * 10 + " 分析结束 " + "=" * 10)

def main():
    if len(sys.argv) < 2:
        print("请提供要分析的文件路径,python analyzer.py <filepath>")
        sys.exit(1)

    target_file = sys.argv[1]

    if not os.path.exists(target_file):
        print(f"文件 '{target_file}' 不存在")
        sys.exit(1)

    master_report = {"file_path": target_file}

    master_report["basic_info"] = analyzer_basic_info(target_file)
    master_report["hashes"] = calc_hash(target_file)
    master_report["string_analysis"] = extract_strings(target_file)

    generate_console_report(master_report)

    report_filename = os.path.basename(target_file) + "_report.json"
    try:
        with open(report_filename, "w", encoding="utf-8") as f:
            # 使用 ensure_ascii=False 并处理非法字符
            json_str = json.dumps(master_report, indent=4, ensure_ascii=False)
            f.write(json_str.encode("utf-8", errors="replace").decode("utf-8"))
        print(f"\n[+] 详细分析报告已保存到: {report_filename}")
    except Exception as e:
        print(f"\n[-] 保存JSON报告失败: {e}")


if __name__ == "__main__":
    main()
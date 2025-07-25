int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int val1 = arr[2];       // 写法1：数组下标
    int val2 = *(arr + 2);   // 写法2：指针运算
    return val1 + val2;
}
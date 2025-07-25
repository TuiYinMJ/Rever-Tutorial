#include <stdio.h>

int main() {
    int arr[3] = {100, 200, 300}; // 数组，先别管
    int *p_int = &arr[0];
    char *p_char = (char*)arr; // 强制转换为 char*

    printf("--- 整型指针 (sizeof(int) = %zu) ---\n", sizeof(int));
    printf("p_int 的地址: %p\n", p_int);
    p_int++;
    printf("p_int++ 后的地址: %p\n", p_int);

    printf("\n--- 字符指针 (sizeof(char) = %zu) ---\n", sizeof(char));
    printf("p_char 的地址: %p\n", p_char);
    p_char++;
    printf("p_char++ 后的地址: %p\n", p_char);

    return 0;
}
#include <stdio.h>

int main() {
    int a = 10;
    int *p;    // 指针变量 p

    p = &a;    // 现在 p 指向 a。

    printf("变量 a 的值: %d\n", a);
    printf("变量 a 的地址: %p\n", &a);
    printf("指针 p 存储的值 (即a的地址): %p\n", p);
    printf("通过指针 p 获取 a 的值 (*p): %d\n", *p);
    *p = 20;
    printf("修改后，变量 a 的值: %d\n", a);

    return 0;
}
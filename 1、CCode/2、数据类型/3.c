#include <stdio.h>

void main(){
    signed char c = -5; // 绝对值5的二进制0000 0101
    // 取反1111 1010
    // +1 = 1111 1011，验证一下
    printf("%p",&c);
}


// 128  64  32  16  8  4  2  1
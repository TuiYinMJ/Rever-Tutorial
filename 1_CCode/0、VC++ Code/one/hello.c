#include <stdio.h>

void main00002(){
    signed char c = -5; // ����ֵ5�Ķ�����0000 0101
    // ȡ��1111 1010
    // +1 = 1111 1011����֤һ��
    printf("%p",&c);
	return 0;
}


// 128  64  32  16  8  4  2  1
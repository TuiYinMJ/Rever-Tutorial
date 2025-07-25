#include <stdio.h>

int main() {
    int arr[3] = {100, 200, 300}; // ���飬�ȱ��
    int *p_int = &arr[0];
    char *p_char = (char*)arr; // ǿ��ת��Ϊ char*

    printf("--- ����ָ�� (sizeof(int) = %zu) ---\n", sizeof(int));
    printf("p_int �ĵ�ַ: %p\n", p_int);
    p_int++;
    printf("p_int++ ��ĵ�ַ: %p\n", p_int);

    printf("\n--- �ַ�ָ�� (sizeof(char) = %zu) ---\n", sizeof(char));
    printf("p_char �ĵ�ַ: %p\n", p_char);
    p_char++;
    printf("p_char++ ��ĵ�ַ: %p\n", p_char);

    return 0;
}
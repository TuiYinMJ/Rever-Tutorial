#include <stdio.h>

int main() {
    int a = 10;
    int *p;    // ָ����� p

    p = &a;    // ���� p ָ�� a��

    printf("���� a ��ֵ: %d\n", a);
    printf("���� a �ĵ�ַ: %p\n", &a);
    printf("ָ�� p �洢��ֵ (��a�ĵ�ַ): %p\n", p);
    printf("ͨ��ָ�� p ��ȡ a ��ֵ (*p): %d\n", *p);
    *p = 20;
    printf("�޸ĺ󣬱��� a ��ֵ: %d\n", a);

    return 0;
}
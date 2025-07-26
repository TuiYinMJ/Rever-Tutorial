#include <stdio.h>

int my_strlen(const char* s){
    const char *start = s;
    while(*s != '\0'){
        s++; // 往前走一个字节
    }
    return s - start; // 指针相减，得到的是字节数
}

int main(){
    char bad_str[] = "Hello World"; 
    int length = my_strlen(bad_str);
    printf("string length: %d\n", length); 
    return 0;
}
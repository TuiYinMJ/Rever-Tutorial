#include <stdio.h>

void modify_array(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] = arr[i] * 10;
    }
}

int main() {
    int my_arr[3] = {1, 2, 3};
    modify_array(my_arr, 3);
    printf("调用后，数组内容为: %d, %d, %d\n", my_arr[0], my_arr[1], my_arr[2]);
    return 0;
}
// vulnerable.c
#include <stdio.h>
#include <string.h>

#define BUFFER_SIZE 256

void process_data(char *user_input, int len) {
    char buffer[BUFFER_SIZE];
	
    if (len < BUFFER_SIZE) {
        printf("Length check passed. Copying %d bytes.\n", len);
        memcpy(buffer, user_input, len);
        printf("Copy finished.\n");
    } else {
        printf("Error: Input length %d is too large.\n", len);
    }
}

int main() {
    char large_input[512] = {0}; 
    process_data(large_input, -1);
    return 0;
}
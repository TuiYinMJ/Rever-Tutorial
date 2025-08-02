#include <stdbool.h>
#include <stddef.h>
#include <stdio.h> // 引入用于打印调试信息

// 堆块的管理头部
typedef struct header {
    size_t size;          // 本块的用户数据区大小
    bool is_free;         // 标记本块是否空闲
    struct header* next;  // 指向链表中的下一个管理头部
} Header;

// 堆大小为10KB
#define HEAP_SIZE 10240
static unsigned char heap[HEAP_SIZE];

// 链表的头部，初始为NULL
static Header* list_head = NULL;

// 声明我们即将实现的 free 函数，因为 malloc 中可能需要它
void my_free(void* ptr);

// 新增一个函数，用于合并空闲块
void coalesce() {
    Header* current = list_head;
    while (current != NULL && current->next != NULL) {
        // 如果当前块和下一个块都是空闲的
        if (current->is_free && current->next->is_free) {
            // 合并！当前块的大小 = 原大小 + 下一个块的头大小 + 下一个块的数据大小
            current->size += sizeof(Header) + current->next->size;
            // 跳过下一个块，直接链接到下下个块
            current->next = current->next->next;
            // 继续从当前块开始检查，看是否能与新的 next 块再次合并
            continue; 
        }
        current = current->next;
    }
}

void* my_malloc(size_t size) {
    // 对齐请求的大小，确保至少能放下我们的头部信息，并且是8字节的倍数，提高兼容性
    if (size == 0) return NULL;
    size_t aligned_size = (size + 7) & ~7;

    // 第一次调用，初始化整个堆
    if (list_head == NULL) {
        list_head = (Header*)heap;
        list_head->size = HEAP_SIZE - sizeof(Header);
        list_head->is_free = true;
        list_head->next = NULL;
    }

    // 遍历链表，寻找第一个足够大的空闲块 (First-Fit策略)
    Header* current = list_head;
    while (current != NULL) {
        if (current->is_free && current->size >= aligned_size) {
            // 找到了合适的块，现在判断是否需要分割
            // 如果剩余空间足够大，可以容纳一个新的Header和一个最小的数据块（比如8字节），就进行分割
            if (current->size > aligned_size + sizeof(Header) + 8) {
                // 计算新块头的地址：跳过当前块的头 + 用户请求的空间
                Header* new_header = (Header*)((unsigned char*)current + sizeof(Header) + aligned_size);
                
                // 设置新块头的信息
                new_header->size = current->size - aligned_size - sizeof(Header);
                new_header->is_free = true;
                new_header->next = current->next; // 新块指向原先的下一个块
                
                // 更新当前块的信息
                current->size = aligned_size; // 大小变为用户请求的大小
                current->is_free = false;     // 标记为已使用
                current->next = new_header;   // 指向分割出的新空闲块
            } else {
                // 剩余空间不大，不分割，直接整个分配
                current->is_free = false;
            }
            
            // 返回用户数据区的起始地址
            return (void*)(current + 1);
        }
        current = current->next;
    }

    // 没找到合适的块
    return NULL;
}


void my_free(void* ptr) {
    if (ptr == NULL) {
        return;
    }

    // 通过用户指针找到块头
    Header* header_to_free = (Header*)ptr - 1;

    // 检查指针合法性 (简单检查)
    if ((unsigned char*)header_to_free < heap || (unsigned char*)header_to_free >= (heap + HEAP_SIZE)) {
        // 非法指针，可能导致严重问题，实际应用中应有更强的错误处理
        return;
    }

    // 标记块为空闲
    header_to_free->is_free = true;
    
    // 调用合并函数，整理内存碎片
    coalesce();
}

int main(){
    int* ptr = my_malloc(sizeof(int)*4);
    printf("%p\n",ptr);
    my_free(ptr);
    printf("%p\n",ptr);
    printf("%p\n",ptr);
    ptr = NULL;
    return 0;
}
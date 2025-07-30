#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main(int argc, char *argv[]) {
    bool show_help = false;
    char *output_file = NULL;
    char *input_file = NULL;

    for (int i = 1; i < argc; i++) {
        // 检查 -h 或 --help 标志
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            show_help = true;
            break;
        } 
        // 检查 -o 标志
        else if (strcmp(argv[i], "-o") == 0) {
            // 确保 -o 后面有内容
            if (i + 1 < argc) {
                output_file = argv[i + 1];
                i++; // 跳过下一个参数名称
            } else {
                fprintf(stderr, "错误：-o 需要传递文件名称，请-h查看帮助\n");
                return 1;
            }
        } 
        else {
            if (input_file == NULL) {
                input_file = argv[i];
            } else {
                fprintf(stderr, "错误：不支持多个输入文件\n");
                return 1;
            }
        }
    }

    if (show_help) {
        printf("用法: %s [options] <input-file>\n", argv[0]);
        printf("选项:\n");
        printf("  -h, --help    显示帮助信息.\n");
        printf("  -o <file>     指定输出文件.\n");
    } else {
        printf("--- 程序配置 ---\n");
        printf("输入文件:  %s\n", input_file ? input_file : "未指定");
        printf("输出文件: %s\n", output_file ? output_file : "未指定");
        printf("-----------------------------\n");
    }

    return 0;
}
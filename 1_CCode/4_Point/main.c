#include <stdio.h>
#include <string.h>

#define MAX_ITEMS 5

// 定义一个游戏物品的结构体
typedef struct {
    int id;
    char name[20];
    float value;
    int type; // 0=武器, 1=护甲, 2=药水
} GameItem;

// 处理单个物品的函数
void process_item(GameItem *item) {
    printf("  正在处理物品 ID %d: %s\n", item->id, item->name);
    // 如果物品价值很高，就打个折
    if (item->value > 50.0f) {
        item->value = item->value * 0.9f;
    }
}

int main() {
    GameItem inventory[MAX_ITEMS];
    int i;

    // --- 第一部分：初始化库存 ---
    printf("正在初始化库存...\n");
    for (i = 0; i < MAX_ITEMS; i++) {
        inventory[i].id = 100 + i;
        inventory[i].value = (i + 1) * 20.0f;
        inventory[i].type = i % 3;
        
        char temp_name[20];
        sprintf(temp_name, "Item-%d", i);
        strcpy(inventory[i].name, temp_name);
    }

    // --- 第二部分：处理所有物品 ---
    printf("\n正在处理库存物品...\n");
    for (i = 0; i < MAX_ITEMS; i++) {
        process_item(&inventory[i]);
        
        // 根据物品类型打印不同信息
        switch (inventory[i].type) {
            case 0:
                printf("    -> 这是一件武器。\n");
                break;
            case 1:
                printf("    -> 这是一件护甲。\n");
                break;
            case 2:
                printf("    -> 这是一瓶药水。\n");
                break;
        }
    }
    printf("\n处理完毕。\n");
    return 0;
}
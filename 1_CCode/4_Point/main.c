#include <stdio.h>
#include <string.h>

struct Player {
    char name[32];
    int level;
    float hp;
    bool is_online;
};

int main() {
    struct Player p1;
    struct Player* p = &p1;
    strcpy(p->name, "Aragorn");
    p->level = 99;
    p->hp = 150.5f;
    p->is_online = true;
    printf("Player: %s, Level: %d\n", p->name, p->level);
    printf("Size of struct Player is: %zu bytes\n", sizeof(struct Player));
}
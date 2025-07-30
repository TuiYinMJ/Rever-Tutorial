# 0 "./main.c"
# 0 "<built-in>"
# 0 "<command-line>"
# 1 "./main.c"
int add(int x, int y) {
    int sum = x + y;
    return sum;
}

int main() {



    int (*myadd)(int,int);
    myadd = add;

    int result = myadd(10,20);

    return 0;
}

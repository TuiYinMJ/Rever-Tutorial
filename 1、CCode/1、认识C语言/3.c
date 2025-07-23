#define PI 3.14159
#define MAX(a, b) ((a) > (b) ? (a) : (b))



int main(){
    double radius = 5.0;
    int x = 10;
    int y = 20;
    double cir = radius * radius * PI;
    int larger_num = MAX(x, y);
    return 0;
}
int main(){
    int arr[10];
    int *p1 = &arr[2];
    int *p2 = &arr[7];

    long long diff = p2 - p1;
    return 0;
}
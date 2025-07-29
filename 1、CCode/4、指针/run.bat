chcp 65001
del mypro.exe
del *.o
del *.i
del *.s
gcc -E ./main.c -o ./mypro.i
gcc -S ./main.c -o ./mypro.s
gcc -c ./main.c -o ./mypro.o
gcc -g ./main.c -O0 -o ./mypro.exe
mypro.exe
#include <stdio.h>

void funcA(){};
void funcB(){};
void funcC(){};
void funcD(){};
void funcE(){};
void funcF(){};
void funcG(){};
void funcH(){};
void funcI(){};

int main00003(){
	int val = 7;
	switch(val) {
		case 0: funcA(); break;
		case 1: funcB(); break;
		case 2: funcC(); break;
		case 3: funcD(); break;
		case 4: funcE(); break;
		case 500: funcF(); break;
		case 1000: funcG(); break;
		case 10000: funcH(); break;
		default: funcI(); break;
	}
/*	int a = 0;
	int x= 0;
    if (a < 10) {
		x = 1;
	} else {
		x = 2;
	}*/
	return 0;
}

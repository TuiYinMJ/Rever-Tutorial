	.file	"main.c"
	.text
	.section .rdata,"dr"
	.align 8
.LC0:
	.ascii "\345\207\275\346\225\260\345\206\205\351\203\250\357\274\214\346\216\245\346\224\266\345\210\260\347\232\204x = %d\12\0"
	.align 8
.LC1:
	.ascii "\345\207\275\346\225\260\345\206\205\351\203\250\357\274\214x\350\242\253\344\277\256\346\224\271\344\270\272 = %d\12\0"
	.text
	.globl	modify_value
	.def	modify_value;	.scl	2;	.type	32;	.endef
	.seh_proc	modify_value
modify_value:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$32, %rsp
	.seh_stackalloc	32
	.seh_endprologue
	movl	%ecx, 16(%rbp)
	movl	16(%rbp), %edx
	leaq	.LC0(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movl	$100, 16(%rbp)
	movl	16(%rbp), %edx
	leaq	.LC1(%rip), %rax
	movq	%rax, %rcx
	call	printf
	nop
	addq	$32, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.section .rdata,"dr"
.LC2:
	.ascii "\350\260\203\347\224\250\345\211\215\357\274\214main\344\270\255\347\232\204a = %d\12\0"
.LC3:
	.ascii "\350\260\203\347\224\250\345\220\216\357\274\214main\344\270\255\347\232\204a = %d\12\0"
	.text
	.globl	main
	.def	main;	.scl	2;	.type	32;	.endef
	.seh_proc	main
main:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$48, %rsp
	.seh_stackalloc	48
	.seh_endprologue
	call	__main
	movl	$10, -4(%rbp)
	movl	-4(%rbp), %edx
	leaq	.LC2(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movl	-4(%rbp), %eax
	movl	%eax, %ecx
	call	modify_value
	movl	-4(%rbp), %edx
	leaq	.LC3(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movl	$0, %eax
	addq	$48, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.def	__main;	.scl	2;	.type	32;	.endef
	.ident	"GCC: (x86_64-posix-seh-rev0, Built by MinGW-Builds project) 15.1.0"
	.def	printf;	.scl	2;	.type	32;	.endef

	.file	"main.c"
	.text
	.section .rdata,"dr"
.LC0:
	.ascii "-h\0"
.LC1:
	.ascii "--help\0"
.LC2:
	.ascii "-o\0"
	.align 8
.LC3:
	.ascii "\351\224\231\350\257\257\357\274\232-o \351\234\200\350\246\201\344\274\240\351\200\222\346\226\207\344\273\266\345\220\215\347\247\260\357\274\214\350\257\267-h\346\237\245\347\234\213\345\270\256\345\212\251\12\0"
	.align 8
.LC4:
	.ascii "\351\224\231\350\257\257\357\274\232\344\270\215\346\224\257\346\214\201\345\244\232\344\270\252\350\276\223\345\205\245\346\226\207\344\273\266\12\0"
	.align 8
.LC5:
	.ascii "\347\224\250\346\263\225: %s [options] <input-file>\12\0"
.LC6:
	.ascii "\351\200\211\351\241\271:\0"
	.align 8
.LC7:
	.ascii "  -h, --help    \346\230\276\347\244\272\345\270\256\345\212\251\344\277\241\346\201\257.\0"
	.align 8
.LC8:
	.ascii "  -o <file>     \346\214\207\345\256\232\350\276\223\345\207\272\346\226\207\344\273\266.\0"
.LC9:
	.ascii "--- \347\250\213\345\272\217\351\205\215\347\275\256 ---\0"
.LC10:
	.ascii "\346\234\252\346\214\207\345\256\232\0"
.LC11:
	.ascii "\350\276\223\345\205\245\346\226\207\344\273\266:  %s\12\0"
.LC12:
	.ascii "\350\276\223\345\207\272\346\226\207\344\273\266: %s\12\0"
.LC13:
	.ascii "-----------------------------\0"
	.text
	.globl	main
	.def	main;	.scl	2;	.type	32;	.endef
	.seh_proc	main
main:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$64, %rsp
	.seh_stackalloc	64
	.seh_endprologue
	movl	%ecx, 16(%rbp)
	movq	%rdx, 24(%rbp)
	call	__main
	movb	$0, -1(%rbp)
	movq	$0, -16(%rbp)
	movq	$0, -24(%rbp)
	movl	$1, -28(%rbp)
	jmp	.L2
.L11:
	movl	-28(%rbp), %eax
	cltq
	leaq	0(,%rax,8), %rdx
	movq	24(%rbp), %rax
	addq	%rdx, %rax
	movq	(%rax), %rax
	leaq	.LC0(%rip), %rdx
	movq	%rax, %rcx
	call	strcmp
	testl	%eax, %eax
	je	.L3
	movl	-28(%rbp), %eax
	cltq
	leaq	0(,%rax,8), %rdx
	movq	24(%rbp), %rax
	addq	%rdx, %rax
	movq	(%rax), %rax
	leaq	.LC1(%rip), %rdx
	movq	%rax, %rcx
	call	strcmp
	testl	%eax, %eax
	jne	.L4
.L3:
	movb	$1, -1(%rbp)
	jmp	.L5
.L4:
	movl	-28(%rbp), %eax
	cltq
	leaq	0(,%rax,8), %rdx
	movq	24(%rbp), %rax
	addq	%rdx, %rax
	movq	(%rax), %rax
	leaq	.LC2(%rip), %rdx
	movq	%rax, %rcx
	call	strcmp
	testl	%eax, %eax
	jne	.L6
	movl	-28(%rbp), %eax
	addl	$1, %eax
	cmpl	%eax, 16(%rbp)
	jle	.L7
	movl	-28(%rbp), %eax
	cltq
	addq	$1, %rax
	leaq	0(,%rax,8), %rdx
	movq	24(%rbp), %rax
	addq	%rdx, %rax
	movq	(%rax), %rax
	movq	%rax, -16(%rbp)
	addl	$1, -28(%rbp)
	jmp	.L8
.L7:
	movl	$2, %ecx
	movq	__imp___acrt_iob_func(%rip), %rax
	call	*%rax
	movq	%rax, %rdx
	leaq	.LC3(%rip), %rax
	movq	%rdx, %r9
	movl	$57, %r8d
	movl	$1, %edx
	movq	%rax, %rcx
	call	fwrite
	movl	$1, %eax
	jmp	.L9
.L6:
	cmpq	$0, -24(%rbp)
	jne	.L10
	movl	-28(%rbp), %eax
	cltq
	leaq	0(,%rax,8), %rdx
	movq	24(%rbp), %rax
	addq	%rdx, %rax
	movq	(%rax), %rax
	movq	%rax, -24(%rbp)
	jmp	.L8
.L10:
	movl	$2, %ecx
	movq	__imp___acrt_iob_func(%rip), %rax
	call	*%rax
	movq	%rax, %rdx
	leaq	.LC4(%rip), %rax
	movq	%rdx, %r9
	movl	$37, %r8d
	movl	$1, %edx
	movq	%rax, %rcx
	call	fwrite
	movl	$1, %eax
	jmp	.L9
.L8:
	addl	$1, -28(%rbp)
.L2:
	movl	-28(%rbp), %eax
	cmpl	16(%rbp), %eax
	jl	.L11
.L5:
	cmpb	$0, -1(%rbp)
	je	.L12
	movq	24(%rbp), %rax
	movq	(%rax), %rdx
	leaq	.LC5(%rip), %rax
	movq	%rax, %rcx
	call	printf
	leaq	.LC6(%rip), %rax
	movq	%rax, %rcx
	call	puts
	leaq	.LC7(%rip), %rax
	movq	%rax, %rcx
	call	puts
	leaq	.LC8(%rip), %rax
	movq	%rax, %rcx
	call	puts
	jmp	.L13
.L12:
	leaq	.LC9(%rip), %rax
	movq	%rax, %rcx
	call	puts
	cmpq	$0, -24(%rbp)
	je	.L14
	movq	-24(%rbp), %rax
	jmp	.L15
.L14:
	leaq	.LC10(%rip), %rax
.L15:
	leaq	.LC11(%rip), %rcx
	movq	%rax, %rdx
	call	printf
	cmpq	$0, -16(%rbp)
	je	.L16
	movq	-16(%rbp), %rax
	jmp	.L17
.L16:
	leaq	.LC10(%rip), %rax
.L17:
	leaq	.LC12(%rip), %rcx
	movq	%rax, %rdx
	call	printf
	leaq	.LC13(%rip), %rax
	movq	%rax, %rcx
	call	puts
.L13:
	movl	$0, %eax
.L9:
	addq	$64, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.def	__main;	.scl	2;	.type	32;	.endef
	.ident	"GCC: (x86_64-posix-seh-rev0, Built by MinGW-Builds project) 15.1.0"
	.def	strcmp;	.scl	2;	.type	32;	.endef
	.def	fwrite;	.scl	2;	.type	32;	.endef
	.def	printf;	.scl	2;	.type	32;	.endef
	.def	puts;	.scl	2;	.type	32;	.endef

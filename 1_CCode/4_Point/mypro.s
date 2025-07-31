	.file	"main.c"
	.text
	.section .rdata,"dr"
.LC1:
	.ascii "Player: %s, Level: %d\12\0"
	.align 8
.LC2:
	.ascii "Size of struct Player is: %zu bytes\12\0"
	.text
	.globl	main
	.def	main;	.scl	2;	.type	32;	.endef
	.seh_proc	main
main:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$96, %rsp
	.seh_stackalloc	96
	.seh_endprologue
	call	__main
	leaq	-64(%rbp), %rax
	movq	%rax, -8(%rbp)
	movq	-8(%rbp), %rax
	movabsq	$31088070239547969, %rdx
	movq	%rdx, (%rax)
	movq	-8(%rbp), %rax
	movl	$99, 32(%rax)
	movq	-8(%rbp), %rax
	movss	.LC0(%rip), %xmm0
	movss	%xmm0, 36(%rax)
	movq	-8(%rbp), %rax
	movb	$1, 40(%rax)
	movq	-8(%rbp), %rax
	movl	32(%rax), %ecx
	movq	-8(%rbp), %rdx
	leaq	.LC1(%rip), %rax
	movl	%ecx, %r8d
	movq	%rax, %rcx
	call	printf
	leaq	.LC2(%rip), %rax
	movl	$44, %edx
	movq	%rax, %rcx
	call	printf
	movl	$0, %eax
	addq	$96, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.section .rdata,"dr"
	.align 4
.LC0:
	.long	1125548032
	.def	__main;	.scl	2;	.type	32;	.endef
	.ident	"GCC: (x86_64-posix-seh-rev0, Built by MinGW-Builds project) 15.1.0"
	.def	printf;	.scl	2;	.type	32;	.endef

	.file	"main.c"
	.text
	.section .rdata,"dr"
	.align 8
.LC0:
	.ascii "  \346\255\243\345\234\250\345\244\204\347\220\206\347\211\251\345\223\201 ID %d: %s\12\0"
	.text
	.globl	process_item
	.def	process_item;	.scl	2;	.type	32;	.endef
	.seh_proc	process_item
process_item:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$32, %rsp
	.seh_stackalloc	32
	.seh_endprologue
	movq	%rcx, 16(%rbp)
	movq	16(%rbp), %rax
	leaq	4(%rax), %rcx
	movq	16(%rbp), %rax
	movl	(%rax), %edx
	leaq	.LC0(%rip), %rax
	movq	%rcx, %r8
	movq	%rax, %rcx
	call	printf
	movq	16(%rbp), %rax
	movss	24(%rax), %xmm0
	comiss	.LC1(%rip), %xmm0
	ja	.L4
	jmp	.L5
.L4:
	movq	16(%rbp), %rax
	movss	24(%rax), %xmm1
	movss	.LC2(%rip), %xmm0
	mulss	%xmm1, %xmm0
	movq	16(%rbp), %rax
	movss	%xmm0, 24(%rax)
.L5:
	nop
	addq	$32, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.section .rdata,"dr"
.LC3:
	.ascii "\346\255\243\345\234\250\345\210\235\345\247\213\345\214\226\345\272\223\345\255\230...\0"
.LC5:
	.ascii "Item-%d\0"
.LC6:
	.ascii "\12\346\255\243\345\234\250\345\244\204\347\220\206\345\272\223\345\255\230\347\211\251\345\223\201...\0"
.LC7:
	.ascii "    -> \350\277\231\346\230\257\344\270\200\344\273\266\346\255\246\345\231\250\343\200\202\0"
.LC8:
	.ascii "    -> \350\277\231\346\230\257\344\270\200\344\273\266\346\212\244\347\224\262\343\200\202\0"
.LC9:
	.ascii "    -> \350\277\231\346\230\257\344\270\200\347\223\266\350\215\257\346\260\264\343\200\202\0"
.LC10:
	.ascii "\12\345\244\204\347\220\206\345\256\214\346\257\225\343\200\202\0"
	.text
	.globl	main
	.def	main;	.scl	2;	.type	32;	.endef
	.seh_proc	main
main:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$240, %rsp
	.seh_stackalloc	240
	.seh_endprologue
	call	__main
	leaq	.LC3(%rip), %rax
	movq	%rax, %rcx
	call	puts
	movl	$0, -4(%rbp)
	jmp	.L7
.L8:
	movl	-4(%rbp), %eax
	leal	100(%rax), %edx
	movl	-4(%rbp), %eax
	cltq
	salq	$5, %rax
	addq	%rbp, %rax
	subq	$176, %rax
	movl	%edx, (%rax)
	movl	-4(%rbp), %eax
	addl	$1, %eax
	pxor	%xmm1, %xmm1
	cvtsi2ssl	%eax, %xmm1
	movss	.LC4(%rip), %xmm0
	mulss	%xmm1, %xmm0
	movl	-4(%rbp), %eax
	cltq
	salq	$5, %rax
	addq	%rbp, %rax
	subq	$152, %rax
	movss	%xmm0, (%rax)
	movl	-4(%rbp), %ecx
	movslq	%ecx, %rax
	imulq	$1431655766, %rax, %rax
	shrq	$32, %rax
	movq	%rax, %rdx
	movl	%ecx, %eax
	sarl	$31, %eax
	subl	%eax, %edx
	movl	%edx, %eax
	addl	%eax, %eax
	addl	%edx, %eax
	subl	%eax, %ecx
	movl	%ecx, %edx
	movl	-4(%rbp), %eax
	cltq
	salq	$5, %rax
	addq	%rbp, %rax
	subq	$148, %rax
	movl	%edx, (%rax)
	movl	-4(%rbp), %ecx
	leaq	.LC5(%rip), %rdx
	leaq	-208(%rbp), %rax
	movl	%ecx, %r8d
	movq	%rax, %rcx
	call	sprintf
	leaq	-176(%rbp), %rax
	movl	-4(%rbp), %edx
	movslq	%edx, %rdx
	salq	$5, %rdx
	addq	%rdx, %rax
	leaq	4(%rax), %rcx
	leaq	-208(%rbp), %rax
	movq	%rax, %rdx
	call	strcpy
	addl	$1, -4(%rbp)
.L7:
	cmpl	$4, -4(%rbp)
	jle	.L8
	leaq	.LC6(%rip), %rax
	movq	%rax, %rcx
	call	puts
	movl	$0, -4(%rbp)
	jmp	.L9
.L14:
	leaq	-176(%rbp), %rax
	movl	-4(%rbp), %edx
	movslq	%edx, %rdx
	salq	$5, %rdx
	addq	%rdx, %rax
	movq	%rax, %rcx
	call	process_item
	movl	-4(%rbp), %eax
	cltq
	salq	$5, %rax
	addq	%rbp, %rax
	subq	$148, %rax
	movl	(%rax), %eax
	cmpl	$2, %eax
	je	.L10
	cmpl	$2, %eax
	jg	.L11
	testl	%eax, %eax
	je	.L12
	cmpl	$1, %eax
	je	.L13
	jmp	.L11
.L12:
	leaq	.LC7(%rip), %rax
	movq	%rax, %rcx
	call	puts
	jmp	.L11
.L13:
	leaq	.LC8(%rip), %rax
	movq	%rax, %rcx
	call	puts
	jmp	.L11
.L10:
	leaq	.LC9(%rip), %rax
	movq	%rax, %rcx
	call	puts
	nop
.L11:
	addl	$1, -4(%rbp)
.L9:
	cmpl	$4, -4(%rbp)
	jle	.L14
	leaq	.LC10(%rip), %rax
	movq	%rax, %rcx
	call	puts
	movl	$0, %eax
	addq	$240, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.section .rdata,"dr"
	.align 4
.LC1:
	.long	1112014848
	.align 4
.LC2:
	.long	1063675494
	.align 4
.LC4:
	.long	1101004800
	.def	__main;	.scl	2;	.type	32;	.endef
	.ident	"GCC: (x86_64-posix-seh-rev0, Built by MinGW-Builds project) 15.1.0"
	.def	printf;	.scl	2;	.type	32;	.endef
	.def	puts;	.scl	2;	.type	32;	.endef
	.def	sprintf;	.scl	2;	.type	32;	.endef
	.def	strcpy;	.scl	2;	.type	32;	.endef

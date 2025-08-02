	.file	"main.c"
	.text
.lcomm heap,10240,32
.lcomm list_head,8,8
	.globl	coalesce
	.def	coalesce;	.scl	2;	.type	32;	.endef
	.seh_proc	coalesce
coalesce:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$16, %rsp
	.seh_stackalloc	16
	.seh_endprologue
	movq	list_head(%rip), %rax
	movq	%rax, -8(%rbp)
	jmp	.L2
.L5:
	movq	-8(%rbp), %rax
	movzbl	8(%rax), %eax
	testb	%al, %al
	je	.L3
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	movzbl	8(%rax), %eax
	testb	%al, %al
	je	.L3
	movq	-8(%rbp), %rax
	movq	(%rax), %rdx
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	movq	(%rax), %rax
	addq	%rdx, %rax
	leaq	24(%rax), %rdx
	movq	-8(%rbp), %rax
	movq	%rdx, (%rax)
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	movq	16(%rax), %rdx
	movq	-8(%rbp), %rax
	movq	%rdx, 16(%rax)
	jmp	.L2
.L3:
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	movq	%rax, -8(%rbp)
.L2:
	cmpq	$0, -8(%rbp)
	je	.L6
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	testq	%rax, %rax
	jne	.L5
.L6:
	nop
	addq	$16, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.globl	my_malloc
	.def	my_malloc;	.scl	2;	.type	32;	.endef
	.seh_proc	my_malloc
my_malloc:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$32, %rsp
	.seh_stackalloc	32
	.seh_endprologue
	movq	%rcx, 16(%rbp)
	cmpq	$0, 16(%rbp)
	jne	.L8
	movl	$0, %eax
	jmp	.L9
.L8:
	movq	16(%rbp), %rax
	addq	$7, %rax
	andq	$-8, %rax
	movq	%rax, -16(%rbp)
	movq	list_head(%rip), %rax
	testq	%rax, %rax
	jne	.L10
	leaq	heap(%rip), %rax
	movq	%rax, list_head(%rip)
	movq	list_head(%rip), %rax
	movq	$10216, (%rax)
	movq	list_head(%rip), %rax
	movb	$1, 8(%rax)
	movq	list_head(%rip), %rax
	movq	$0, 16(%rax)
.L10:
	movq	list_head(%rip), %rax
	movq	%rax, -8(%rbp)
	jmp	.L11
.L15:
	movq	-8(%rbp), %rax
	movzbl	8(%rax), %eax
	testb	%al, %al
	je	.L12
	movq	-8(%rbp), %rax
	movq	(%rax), %rax
	cmpq	-16(%rbp), %rax
	jb	.L12
	movq	-8(%rbp), %rax
	movq	(%rax), %rax
	movq	-16(%rbp), %rdx
	addq	$32, %rdx
	cmpq	%rax, %rdx
	jnb	.L13
	movq	-16(%rbp), %rax
	leaq	24(%rax), %rdx
	movq	-8(%rbp), %rax
	addq	%rdx, %rax
	movq	%rax, -24(%rbp)
	movq	-8(%rbp), %rax
	movq	(%rax), %rax
	subq	-16(%rbp), %rax
	leaq	-24(%rax), %rdx
	movq	-24(%rbp), %rax
	movq	%rdx, (%rax)
	movq	-24(%rbp), %rax
	movb	$1, 8(%rax)
	movq	-8(%rbp), %rax
	movq	16(%rax), %rdx
	movq	-24(%rbp), %rax
	movq	%rdx, 16(%rax)
	movq	-8(%rbp), %rax
	movq	-16(%rbp), %rdx
	movq	%rdx, (%rax)
	movq	-8(%rbp), %rax
	movb	$0, 8(%rax)
	movq	-8(%rbp), %rax
	movq	-24(%rbp), %rdx
	movq	%rdx, 16(%rax)
	jmp	.L14
.L13:
	movq	-8(%rbp), %rax
	movb	$0, 8(%rax)
.L14:
	movq	-8(%rbp), %rax
	addq	$24, %rax
	jmp	.L9
.L12:
	movq	-8(%rbp), %rax
	movq	16(%rax), %rax
	movq	%rax, -8(%rbp)
.L11:
	cmpq	$0, -8(%rbp)
	jne	.L15
	movl	$0, %eax
.L9:
	addq	$32, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.globl	my_free
	.def	my_free;	.scl	2;	.type	32;	.endef
	.seh_proc	my_free
my_free:
	pushq	%rbp
	.seh_pushreg	%rbp
	movq	%rsp, %rbp
	.seh_setframe	%rbp, 0
	subq	$48, %rsp
	.seh_stackalloc	48
	.seh_endprologue
	movq	%rcx, 16(%rbp)
	cmpq	$0, 16(%rbp)
	je	.L21
	movq	16(%rbp), %rax
	subq	$24, %rax
	movq	%rax, -8(%rbp)
	leaq	heap(%rip), %rax
	cmpq	%rax, -8(%rbp)
	jb	.L22
	leaq	10240+heap(%rip), %rax
	cmpq	%rax, -8(%rbp)
	jnb	.L22
	movq	-8(%rbp), %rax
	movb	$1, 8(%rax)
	call	coalesce
	jmp	.L16
.L21:
	nop
	jmp	.L16
.L22:
	nop
.L16:
	addq	$48, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.section .rdata,"dr"
.LC0:
	.ascii "%p\12\0"
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
	movl	$16, %ecx
	call	my_malloc
	movq	%rax, -8(%rbp)
	movq	-8(%rbp), %rdx
	leaq	.LC0(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movq	-8(%rbp), %rax
	movq	%rax, %rcx
	call	my_free
	movq	-8(%rbp), %rdx
	leaq	.LC0(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movq	-8(%rbp), %rdx
	leaq	.LC0(%rip), %rax
	movq	%rax, %rcx
	call	printf
	movq	$0, -8(%rbp)
	movl	$0, %eax
	addq	$48, %rsp
	popq	%rbp
	ret
	.seh_endproc
	.def	__main;	.scl	2;	.type	32;	.endef
	.ident	"GCC: (x86_64-posix-seh-rev0, Built by MinGW-Builds project) 15.1.0"
	.def	printf;	.scl	2;	.type	32;	.endef

This is where it all started, this is the very first writeup i release

I have installed a sub os in the wsl and gdb in the sub os (its an ubuntu i forgot, its been a while. not kali), those are the tools i have used in this tutorial
(im not shamless enough to call this crackme a "challenge")

After cd to the directory that contains the crackme, i activated gdb on the programe
>gdb main.out

Then i disassemble it to get the assembly code
>dissasemble main

Here was what i got
(gdb) disassemble main
Dump of assembler code for function main:
   0x0000000000001150 <+0>:     endbr64
   0x0000000000001154 <+4>:     push   %rbp
   0x0000000000001155 <+5>:     mov    %rsp,%rbp
   0x0000000000001158 <+8>:     sub    $0x10,%rsp
   0x000000000000115c <+12>:    movl   $0x0,-0x4(%rbp)
   0x0000000000001163 <+19>:    lea    0xe9a(%rip),%rdi        # 0x2004
   0x000000000000116a <+26>:    mov    $0x0,%al
   0x000000000000116c <+28>:    call   0x1050 <printf@plt>
   0x0000000000001171 <+33>:    movl   $0xa,-0x8(%rbp)
   0x0000000000001178 <+40>:    cmpl   $0xa,-0x8(%rbp)
   0x000000000000117c <+44>:    je     0x118e <main+62>
   0x000000000000117e <+46>:    lea    0xeab(%rip),%rdi        # 0x2030
   0x0000000000001185 <+53>:    mov    $0x0,%al
   0x0000000000001187 <+55>:    call   0x1050 <printf@plt>
   0x000000000000118c <+60>:    jmp    0x11a4 <main+84>
   0x000000000000118e <+62>:    cmpl   $0xa,-0x8(%rbp)
   0x0000000000001192 <+66>:    jne    0x11a2 <main+82>
   0x0000000000001194 <+68>:    lea    0xe9f(%rip),%rdi        # 0x203a
   0x000000000000119b <+75>:    mov    $0x0,%al
   0x000000000000119d <+77>:    call   0x1050 <printf@plt>
   0x00000000000011a2 <+82>:    jmp    0x11a4 <main+84>
   0x00000000000011a4 <+84>:    mov    -0x4(%rbp),%eax
   0x00000000000011a7 <+87>:    add    $0x10,%rsp
   0x00000000000011ab <+91>:    pop    %rbp
   0x00000000000011ac <+92>:    ret
End of assembler dump.

The crackme is kind of an introduction to the rev eng, everything is very simple and straight forward.
And the most important part in this tutorial is to learn to read and understand the assembly gdb spit out in-order to reverse engineer the code.
Thats why i did a little dive into the assembly and try to understand whatever that is. 
Here is the result(the comments)

(gdb) disassemble main
Dump of assembler code for function main:
   0x0000000000001150 <+0>:     endbr64 
   >security marker and can ignore logically, it tells it is a valid function entry point
   0x0000000000001154 <+4>:     push   %rbp
   >"push" means "save to stack", this line saves the caller's base pointer
   0x0000000000001155 <+5>:     mov    %rsp,%rbp
   >"mov" means "copy a value", this line start a new stack frame 
   0x0000000000001158 <+8>:     sub    $0x10,%rsp
   >reserve 16 butyes for local variables
   0x000000000000115c <+12>:    movl   $0x0,-0x4(%rbp)
   >int a = 0 
   0x0000000000001163 <+19>:    lea    0xe9a(%rip),%rdi        # 0x2004
   >Load address of string at 0x2004 into 1st arg register
   0x000000000000116a <+26>:    mov    $0x0,%al
   >No float args (ABI requirement for variadic call)
   0x000000000000116c <+28>:    call   0x1050 <printf@plt>
   >printf(string at 0x2004)
   0x0000000000001171 <+33>:    movl   $0xa,-0x8(%rbp)
   >int b = 10
   0x0000000000001178 <+40>:    cmpl   $0xa,-0x8(%rbp)
   >compare b with 10
   0x000000000000117c <+44>:    je     0x118e <main+62>
   >if (b == 10) goto main+62 -> always true, always jumps
   0x000000000000117e <+46>:    lea    0xeab(%rip),%rdi        # 0x2030
   >(skipped) load SUCCESS string at 0x2030
   0x0000000000001185 <+53>:    mov    $0x0,%al
   >(skipped)
   0x0000000000001187 <+55>:    call   0x1050 <printf@plt>
   >(skipped) printf(SUCCESS);
   0x000000000000118c <+60>:    jmp    0x11a4 <main+84>
   >(skipped) goto end
   0x000000000000118e <+62>:    cmpl   $0xa,-0x8(%rbp)
   >compare b with 10 (again, still 10)
   0x0000000000001192 <+66>:    jne    0x11a2 <main+82>
   >if (b != 10) goto main+82 -> never true, never jumps
   0x0000000000001194 <+68>:    lea    0xe9f(%rip),%rdi        # 0x203a
   >Load FAILURE string at 0x203a into 1st arg register
   0x000000000000119b <+75>:    mov    $0x0,%al
   >No float args
   0x000000000000119d <+77>:    call   0x1050 <printf@plt>
   >printf(FAILURE); <-always excutes
   0x00000000000011a2 <+82>:    jmp    0x11a4 <main+84>
   >goto end
   0x00000000000011a4 <+84>:    mov    -0x4(%rbp),%eax
   >return a; -> return 0
   0x00000000000011a7 <+87>:    add    $0x10,%rsp
   >Release local variables
   0x00000000000011ab <+91>:    pop    %rbp
   >restore caller's base pointer
   0x00000000000011ac <+92>:    ret
   >return to caller
End of assembler dump.

So it is a pretty simple code that prints different string base on the outcome of the comparison.
In C its basically like this.

int main() {
    int a = 0;
    int b = 10;

    printf(string_at_0x2004);   // greeting/prompt

    if (b == 10)                // ALWAYS true
        goto skip_success;      // jumps OVER success

    printf(SUCCESS);            // never reached

skip_success:
    if (b != 10)                // ALWAYS false
        goto skip_failure;      // never jumps

    printf(FAILURE);            // always reached

skip_failure:
    return a;                   // return 0
}

I think thats it, from chosing the tools to use -> dissasemble the programe -> read and understands the assembly code spitted out from gdb -> reverse engineer the original code.

After i have finished the intro i still have nearly 0 idea on how to learn to read the assembly effectively, guess ill have to rely on AI to translate the code for me for a while lmaooo.

Fin.
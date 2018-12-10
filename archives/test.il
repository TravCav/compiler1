.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.locals init ([0] int32, [1] int32, [2] int32)
.entrypoint
ldstr "Hello world"
call void [mscorlib]System.Console::WriteLine(string)
nop
ldc.i4.s 1
stloc 0
nop
ldc.i4.s 42 
stloc 1
nop
ldc.i4.s 42 
stloc 2
nop
// go get a
ret
}

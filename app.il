.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.entrypoint
.locals init ([0] int32, [1] int32, [2] int32)
ldstr "Hello world"
call void [mscorlib]System.Console::WriteLine(string)
nop
ldc.i4.s 1
stloc 0
nop
ldc.i4.s 42 stloc 1
nop
ldc.i4.s 42 stloc 2
// go get a
ldloc.s 2call void [mscorlib]System.Console::WriteLine(int32)
nop
// TinyNumber life equals 42
ret
}

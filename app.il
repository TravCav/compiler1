.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.entrypoint
ldstr "Hello world"
call void [mscorlib]System.Console::WriteLine(string)
//nop
//ldc.i4.s 1
//stloc 0
//nop
//ldc.i4.s 42 
//stloc 99
//nop
ldc.i4.s 42 
//stloc.s 0
//nop
//ldloc.0
call void [mscorlib]System.Console::WriteLine(int32)
ret
}

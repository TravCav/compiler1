.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.entrypoint
.locals init ([0] int32 a)
ldc.i4.s 34 stloc 0
ldloc.s 0
call void [mscorlib]System.Console::WriteLine(int32)
TinyNumber life equals 42
ret
}

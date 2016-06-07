.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.entrypoint
.locals init ([0] int32 c)
ldc.i4.s 34 
stloc c
ldloc c
call void [mscorlib]System.Console::WriteLine(int32)
ret
}

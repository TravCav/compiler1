.assembly yep {}
.assembly extern mscorlib {}
.method static void Main()
{
.entrypoint
.locals init ([0] int32)
ldstr "Hello world"
call void [mscorlib]System.Console::WriteLine(string)

// nuthin sounds better than nop
nop

// these just replace IL statements 1:1. pushin and popin in style
ldc.i4.s 1
stloc 0

// this does a push and pop in one easy step
ldc.i4.s 42 stloc 0

// pushin an poppin's never been so easy
ldc.i4.s 127 stloc 0
ldloc.s 0
call void [mscorlib]System.Console::WriteLine(int32)

// this does 4 things
ldc.i4.s 42 stloc 0
ldloc.s 0call void [mscorlib]System.Console::WriteLine(int32)

// this hasn't been implemented yet.
// TinyNumber life equals 42
ret
}

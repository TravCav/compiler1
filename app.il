.assembly app {}
.assembly extern mscorlib {}
.method static void  Main()
{
  .entrypoint
  .maxstack  1
  //.locals init ([0] int32 a)
  IL_0000:  nop
  IL_0001:  ldc.i4.5
  IL_0002:  stloc.0
  IL_0003:  ret
} // end of method Program::Main

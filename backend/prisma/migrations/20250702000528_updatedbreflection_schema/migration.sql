-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

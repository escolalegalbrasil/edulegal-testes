"use strict";
/* Pré-carga do Livro 0 no ambiente de testes.
 * Isola o progresso local por identidade autenticada. Nunca usa IDs do navegador
 * para autorizar consultas: toda operação no Supabase é revalidada por Auth + RLS.
 */
(function(){
 const BOOK_KEY="edulegal:livro0:ponto-de-partida:v1";
 const PROJECT_REF="feijoegkjleirfzbumnk";
 const TOKEN_KEY="sb-"+PROJECT_REF+"-auth-token";
 let userId=null;
 try {
   const session=JSON.parse(localStorage.getItem(TOKEN_KEY)||"null");
   if(session?.user?.id && /^[0-9a-f-]{36}$/i.test(session.user.id))userId=session.user.id;
 }catch(_){}
 let scope=userId?"aluno:"+userId:"";
 if(!scope){
   try{
     scope=sessionStorage.getItem("edulegal:livro0:guest-scope-v1");
     if(!scope){scope="guest:"+crypto.randomUUID();sessionStorage.setItem("edulegal:livro0:guest-scope-v1",scope);}
   }catch(_){scope="guest:temporario";}
 }
 Object.defineProperty(window,"EduLegalBookLocalScope",{value:Object.freeze({
   bookKey:BOOK_KEY+":"+scope,
   userId:userId,
   isGuest:!userId
 }),writable:false,configurable:false});
})();
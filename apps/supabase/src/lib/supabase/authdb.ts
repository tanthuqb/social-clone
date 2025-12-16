import { createClient } from "./server";
import { redirect } from 'next/navigation';
export default async function GetAuth() {
  const supabase = createClient()
  const {data:session} = await supabase.auth.getUser()
  if(!session?.user){
    redirect(`/`)
  }
}
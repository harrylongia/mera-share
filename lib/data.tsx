import { supabase } from "./api";
export const getDataFromCode = async (shareObjectCode: string) => {
  return await supabase
    .from("share_table")
    .select("id,share_item,code,lang")
    .eq("code", shareObjectCode)
    .single();
};

export const createDataFromUrl = async (url:string) => {
  const userInfo = await (await fetch("https://ipapi.co/json/")).json();
  return await supabase
    .from("share_table")
    .insert([{ code: url, creator_info: userInfo }])
    .select("id");
};

export const updateData = async (text:string,lang:string,id:number | undefined) => {
    return await supabase
      .from("share_table")
      .update({ share_item: text, lang: lang })
      .eq("id", id);
  };

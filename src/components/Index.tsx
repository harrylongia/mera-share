import { useEffect, useState } from "react";
import { supabase } from "../../lib/api";
import { useParams } from "react-router-dom";
// import RecoverPassword from "./RecoverPassword";
// import TodoItem from "./TodoItem";

export interface ShareObject {
  id?: number;
  code: string;
  share_item: string;
  created_at: string;
}

const Index = () => {
  const { url } = useParams<{ url: any }>();
  const [shareObject, setShareObject] = useState<ShareObject>({
    code: "",
    share_item: "",
    created_at: "",
  });
  const [shareText, setShareText] = useState("");
  // const [status,setStatus] = useState(0);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrCreateObject(url);
  }, []);

  useEffect(()=>{
    updateObject(shareText)
  },[shareText])

  const fetchOrCreateObject = async (share_object_code: string) => {

    let { data: share_response, error } = await supabase
      .from("share_table")
      .select("id,share_item,code")
      .eq("code", share_object_code)
      .single();

    if (error?.code == "PGRST116") {
      const userInfo = await (await fetch('https://ipapi.co/json/')).json()
      const response = await supabase
        .from("share_table")
        .insert([{ code: url,creator_info:userInfo}]).select("id");

      if (response.status==201) {
        setShareObject((p)=>({...p,code:url,id:response?.data?.[0]?.id}));
      } 
      else if (response.error) {
        console.log("create error", response.error);
      }

    } else if (error) {
      console.log("fetch error", error);
    } else {
      setShareObject(share_response as ShareObject);
      setShareText(share_response?.share_item)
    }
  };

  const updateObject = async (text: string) => {
    const response = await supabase
      .from("share_table")
      .update({ share_item: text })
      .eq("id", shareObject.id);
      if (response.status == 204) {
      console.log(response)
      setShareObject((p) => ({ ...p, share_item: text }));
    } else if (response.error) {
      console.log("create error", response.error);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col p-10 overflow-auto">
      <h1 className="my-5">Your Code: {shareObject.code}</h1>
      <textarea
        onChange={(e) => setShareText(e.target.value)}
        value={shareText || ""}
        className="h-full font-mono outline-none bg-gray-600 p-5  w-full min-h-[40vh]"
      ></textarea>
      <div className="flex w-full m-4 gap-4">
        <button
          onClick={() => updateObject(shareText)}
          className="bg-yellow-400 p-2 text-black font-semibold rounded-md"
        >
          Save
        </button>
        <button
          onClick={() => updateObject("")}
          className="bg-yellow-400 p-2 font-semibold text-black rounded-md"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Index;

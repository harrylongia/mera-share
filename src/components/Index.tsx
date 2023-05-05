import { useEffect, useState } from "react";
import { supabase } from "../../lib/api";
import { useParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
// import RecoverPassword from "./RecoverPassword";
// import TodoItem from "./TodoItem";

export interface ShareObject {
  id?: number;
  code: string;
  share_item: string;
  created_at: string;
  lang:string;
}

const supportedLanguages = ["java","cpp","javascript","python","json","html","markdown"]

// https://github.com/wooorm/refractor#syntaxes

const Index = () => {
  const { url } = useParams<{ url: any }>();
  const [shareObject, setShareObject] = useState<ShareObject>({
    code: "",
    share_item: "",
    created_at: "",
    lang:""
  });
  const [shareText, setShareText] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [language,setLanguage] = useState("java");

  // const [status,setStatus] = useState(0);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrCreateObject(url);
  }, []);

  useEffect(() => {
    updateObject(shareText);
  }, [shareText]);

  const fetchOrCreateObject = async (share_object_code: string) => {
    let { data: share_response, error } = await supabase
      .from("share_table")
      .select("id,share_item,code,lang")
      .eq("code", share_object_code)
      .single();

    if (error?.code == "PGRST116") {
      const userInfo = await (await fetch("https://ipapi.co/json/")).json();
      const response = await supabase
        .from("share_table")
        .insert([{ code: url, creator_info: userInfo }])
        .select("id");

      if (response.status == 201) {
        setShareObject((p) => ({
          ...p,
          code: url,
          id: response?.data?.[0]?.id,
        }));
      } else if (response.error) {
        console.log("create error", response.error);
      }
    } else if (error) {
      console.log("fetch error", error);
    } else {
      setShareObject(share_response as ShareObject);
      setShareText(share_response?.share_item);
      setLanguage(share_response?.lang);
    }
  };

  const updateObject = async (text: string,lang = language) => {
    const response = await supabase
      .from("share_table")
      .update({ share_item: text,lang:lang })
      .eq("id", shareObject.id);
    if (response.status == 204) {
      console.log(response);
      setShareObject((p) => ({ ...p, share_item: text }));
    } else if (response.error) {
      console.log("create error", response.error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-10">
      <h1 className="my-5">Your Code: {shareObject.code}</h1>
      {/* <textarea
        onChange={(e) => setShareText(e.target.value)}
        value={shareText || ""}
        className="h-full font-mono outline-none bg-gray-600 p-5  w-full min-h-[40vh]"
      >
      </textarea> */}
      <CodeEditor
      className="min-h-60"
        value={shareText}
        language={language}
        onChange={(evn) => setShareText(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <div className="flex w-full my-4 gap-4">
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
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center capitalize w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              id="menu-button"
              aria-expanded={isDropDownOpen}
              aria-haspopup="true"
              onClick={() => setIsDropDownOpen(!isDropDownOpen)}
            >
             {language}
              {/* Heroicon name: chevron-down */}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l.707-.707z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isDropDownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                {supportedLanguages.map((eachLanguage:string)=>{
                  return(
                    <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                  onClick={()=>{
                    setLanguage(eachLanguage)
                    setIsDropDownOpen(false)
                    updateObject(shareText,eachLanguage)
                  }}
                >
                  {eachLanguage}
                </div>
                  )
                })}
               
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

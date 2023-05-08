import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import DropDown from "./DropDown";
import { createDataFromUrl, getDataFromCode, updateData } from "../../lib/data";
import { ShareObject } from "../types";

let timerId: any;

const Index = () => {
  const { url } = useParams<{ url: any }>();
  const [shareObject, setShareObject] = useState<ShareObject>({
    code: "",
    share_item: "",
    created_at: "",
    lang: "",
  });
  const [shareText, setShareText] = useState("");
  const [language, setLanguage] = useState("java");
  const [status, setStatus] = useState(1); // 1 = loading
  const [copyText, setCopyText] = useState("📋");

  useEffect(() => {
    fetchOrCreateObject(url);
  }, []);

  useEffect(() => {
    setStatus(1);
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      updateObject(shareText);
      setStatus(0);
    }, 500);
  }, [shareText]);

  const fetchOrCreateObject = async (shareObjectCode: string) => {
    const getResponse = await getDataFromCode(shareObjectCode);

    if (getResponse.error?.code == "PGRST116") {
      const createResponse = await createDataFromUrl(url);

      if (createResponse.status == 201) {
        setShareObject((p) => ({
          ...p,
          code: url,
          id: createResponse?.data?.[0]?.id,
        }));
      } else if (createResponse.error) {
        console.log("create error", createResponse.error);
      }
    } else if (getResponse.error) {
      console.log("fetch error", getResponse.error);
    } else {
      setShareObject(getResponse.data as ShareObject);
      setShareText(getResponse.data?.share_item);
      setLanguage(getResponse.data?.lang);
      setStatus(0);
    }
  };

  const updateObject = async (text: string, lang = language) => {
    const response = await updateData(text, lang, shareObject.id);
    if (response.status == 204) {
      console.log(response, timerId);
      setShareObject((p) => ({ ...p, share_item: text }));
    } else if (response.error) {
      console.log("create error", response.error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopyText("Copied !");
    setTimeout(() => {
      setCopyText("📋");
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-10">
      <h1 className="mt-5">Your Code: {shareObject.code}</h1>
      <div className="flex w-full pb-2">
        {status == 1 ? (
          <div className="h-5 w-5 ml-auto border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
        ) : (
          <div
            onClick={handleCopy}
            className={`bg-gray-600 h-6 ml-auto flex items-center cursor-pointer rounded-sm${
              copyText == "Copied !" && " text-xs px-1"
            }`}
          >
            {copyText}
          </div>
        )}
      </div>
      <CodeEditor
        className="min-h-60 font-mono"
        value={shareText}
        language={language}
        onChange={(evn) => setShareText(evn.target.value)}
      />
      <div className="flex w-full my-4 gap-4">
        <button
          onClick={() => updateObject(shareText)}
          className="bg-yellow-400 text-xs px-2 text-black font-semibold rounded-md"
        >
          Save
        </button>
        <button
          onClick={() => updateObject("")}
          className="bg-yellow-400 text-xs px-2 font-semibold text-black rounded-md"
        >
          Clear
        </button>
        <DropDown
          language={language}
          setLanguage={setLanguage}
          updateObject={updateObject}
          shareText={shareText}
        />
      </div>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { supabase } from "../../lib/api";
// import RecoverPassword from "./RecoverPassword";
// import TodoItem from "./TodoItem";

export interface ShareObject {
  id: number;
  user_mac: string;
  user_ip: string;
  code: string;
  share_item: string;
  created_at: string;
}

const Home = () => {
  const [shareObject, setShareObject] = useState<ShareObject>({});
  const [shareText, setShareText] = useState<string>("");
  //   const [isShareAvailabe,setIsShareAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let url = window.location.pathname.split("/")[1];
    fetchObject(url);
    console.log(shareObject);
  }, []);

  const fetchObject = async (share_object_code: string) => {
    let { data: share_response, error } = await supabase
      .from("share_table")
      .select("*")
      .eq("code", share_object_code)
      .single();
    if (error) {
    }
    else {
        setShareObject(share_response as ShareObject)
        setShareText(share_response?.share_item);
    };
  };

  useEffect(() => {}, [shareText]);

  const createObject = async () => {
    const response = await supabase
      .from("share_table")
      .insert([{ code: "someValue", other_column: "otherValue" }]);
    if (response.error) {
        console.log("create error", response.error);
    }
  };

  // const deleteTodo = async (id: number) => {
  //     try {
  //         await supabase.from("todos").delete().eq("id", id);
  //         setTodos(todos.filter((x) => x.id !== id));
  //     } catch (error) {
  //         console.log("error", error);
  //     }
  // };

  // const addTodo = async () => {
  //     let taskText = newTaskTextRef.current!.value;
  //     let task = taskText.trim();
  //     if (task.length <= 3) {
  //         setError("Task length should be more than 3!");
  //     } else {
  //         let { data: todo, error } = await supabase
  //             .from("todos")
  //             .insert({ task, user_id: user.id })
  //             .single();
  //         if (error) setError(error.message);
  //         else {
  //             setTodos([todo, ...todos]);
  //             setError(null);
  //             newTaskTextRef.current!.value = "";
  //         }
  //     }
  // };

  // const handleLogout = async () => {
  //     supabase.auth.signOut().catch(console.error);
  // };

  return (
    <div className="w-screen min-h-screen flex flex-col p-10 overflow-auto">
      <h1 className="my-5">Your Code: {shareObject.code}</h1>
      <textarea
        onChange={(e) => setShareText(e.target.value)}
        value={shareText}
        className="h-full font-mono outline-none bg-gray-600 p-5  w-full min-h-[40vh]"
      ></textarea>
      <div className="flex w-full gap-4">
        <button className="bg-yellow-400 p-2 text-black font-semibold rounded-md">
          Save
        </button>
        <button className="bg-yellow-400 p-2 font-semibold text-black rounded-md">
          Clear
        </button>
      </div>
    </div>
  );
};

export default Home;

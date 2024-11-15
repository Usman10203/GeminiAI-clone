"use client";
import runChat from "@/lib/gemini";
import React, { createContext, useState } from "react";

export const Context = createContext();
const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState("");
  const [displayResult, setDisplayResult] = useState(false);
  const [prevPrompts, setPrevPrompts] = useState([]);

  // paragraph delay generating effect
  const paragraphDelay = async (index, newWord) => {
    setTimeout(() => {
      setResult((prev) => prev + newWord);
    }, 70 * index);
    setTimeout(() => {
      setLoading(false);
    }, 1000)
  };
  // on submit original
  // const submit = async (prompt) => {

  //   setLoading(true);
  //   setResult("");
  //   setDisplayResult(true);
  //   setRecentPrompts(input);

  //   if (input && prompt) {
  //     setPrevPrompts((prev) => [...prev, input]);
  //   }
  //   const response = input ? await runChat(input) : await runChat(prompt);
  //   //input is the text entered by the user and prompt is recent chats prompts

  //   const boldResponse = response.split("**"); //converts into array of strings bolding the double **
  //   let newArray = "";
  //   for (let i = 0; i < boldResponse.length; i++) {
  //     if (i === 0 || i % 2 !== 1) { //logic for even data
  //       newArray += boldResponse[i];
  //     } else {
  //       newArray += "<b>" + boldResponse[i] + "</b>"; //logic for odd data
  //     }
  //   }
  //   let newRes = newArray.split("*").join("</br>");
  //   let newRes2 = newRes.split(" ");

  //   for (let i = 0; i < newRes2.length; i++) {
  //     const newWord = newRes2[i];
  //     paragraphDelay(i, newWord + " ");
  //   }
  //   //setLoading(false);
  //   setInput("");

  // };

  const submit = async (prompt) => {
    setLoading(true);
    setResult("");
    setDisplayResult(true);
    setRecentPrompts(input);

    try {
      // Store the previous prompt if available
      if (input && prompt) {
        console.log(`inside the submit`);
        setPrevPrompts((prev) => [...prev, input]);
      }

      console.log(input)
      // Fetch response using await, wrapped in try-catch
      const response = input ? await runChat(input) : await runChat(prompt);

      // Process response to add bold formatting
      const boldResponse = response.split("**");
      let newArray = "";
      for (let i = 0; i < boldResponse.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newArray += boldResponse[i];
        } else {
          newArray += "<b>" + boldResponse[i] + "</b>";
        }
      }

      // Convert `*` to line breaks and split into words for paragraphDelay effect
      const newRes = newArray.split("*").join("</br>");
      const newRes2 = newRes.split(" ");

      // Display each word with a delay
      for (let i = 0; i < newRes2.length; i++) {
        const newWord = newRes2[i];
        await paragraphDelay(i, newWord + " ");

        // setLoading(false);
        setInput("");
      }
    } catch (error) {
      console.error("Error in submitting prompt:", error);
      setLoading(false)
    }
  };



  // light and dark mode
  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const contextValue = {
    theme,
    toggle,
    submit,
    setInput,
    input,
    result,
    loading,
    displayResult,
    recentPrompts,
    setRecentPrompts,
    setPrevPrompts,
    prevPrompts,
    setDisplayResult,
  };
  return (
    <Context.Provider value={contextValue}>
      <div className={theme}>{children}</div>
    </Context.Provider>
  );
};

export default ContextProvider;

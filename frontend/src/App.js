import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";

function App() {

  const [plainText, setPlainText] = useState("");
 
  // Browser-safe RTF → plain text converter
  function rtfToText(rtf) {
    return rtf
      .replace(/\\par[d]?/g, "\n") // paragraph breaks
      .replace(/\\'[0-9a-fA-F]{2}/g, "") // hex encoded chars
      .replace(/\\[a-z]+\d* ?/g, "") // control words like \b, \fs24
      .replace(/[{}]/g, "") // remove braces
      .replace(/\n\s*\n/g, "\n\n") // collapse empty lines
      .trim();
  }
 
  useEffect(() => {
    const rtfString = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}} {\\*\\generator Riched20 10.0.26100}\\viewkind4\\uc1 \\pard\\f0\\fs17 CancelRx Approval\\par } `;
 
    const cleaned = rtfToText(rtfString);
    setPlainText(cleaned);
  }, []);
  return (
      <div
      style={{
        padding: "20px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
      }}
    >
      <h3>Extracted Message</h3>
      <div>{plainText}</div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import Li from "./Li";
import "../cssFiles/fileStyle.css";

function FilesList() {
  const [fileArray, setFileArray] = useState([]);
  const [status, setStatus] = useState(false);
  let path = `http://localhost:8080/users/admin`;

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setFileArray(data);
      });
  }, [status]);

  function deleteFile(name) {
    fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((data) => setStatus(!status))
      .catch((error) => console.error(error));
  }

  function makeNewFile() {
    let fileName = prompt("New Files Name:");
    let isFile = prompt("File/Folder");
    let reqPostObj = { name: fileName, type: isFile, data: "" };
    fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPostObj),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then((data) => setStatus(!status))
      .catch((error) => console.error(error));
  }

  return (
    <div className="fileContainer">
      <h1>Here are your files ma lord</h1>
      <button onClick={makeNewFile} id="addBtn">
        Add New File
      </button>
      <div className="file title">
        <p>Name:</p>
        <p>Type:</p>
        <p>Date Of Creation:</p>
        <p>Size:</p>
      </div>
      {fileArray.map((file, index) => {
        return <Li key={file.id} delete={deleteFile} file={file} index={index} />;
      })}
    </div>
  );
}

export default FilesList;

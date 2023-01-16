import React, { useState, useEffect } from "react";
import Li from "./Li";
import "../cssFiles/fileStyle.css";
import "../cssFiles/indexMenu.css";

function FilesList() {
  const [fileArray, setFileArray] = useState([]);
  const [status, setStatus] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const [selectedFile, setselectedFile] = useState("");

  let path = `http://localhost:8080/users/admin`;

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setFileArray(data);
      });
  }, [status]);
  
  const copyRequest = () => {
    console.log(path + `/${selectedFile.name}`);
    console.log(' name: selectedFile.name: ', selectedFile.name);
    console.log(' type: selectedFile.type: ',  selectedFile.type);
    fetch(path , {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedFile.type, intention: 'copy', name: selectedFile.name }),
      
    })
      .then((response) => {console.log(response.json())})
      .then(() => setStatus(!status));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });

    let fileName =
      e.target.getAttribute("name") ||
      e.target.parentElement.getAttribute("name");
    const currentFile = fileArray.find((file) => file.name === fileName);
    setselectedFile(currentFile);
  };

  const handleClick = (e) => {
    setShowMenu(false);
  };

  function deleteFile(file) {
    fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name }),
    })
      .then((response) => response.json())
      .then(() => setStatus(!status))
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
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      className="fileContainer"
    >
      <h1>Here are your files ma lord</h1>
      {showMenu && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            left: menuPosition.x,
            top: menuPosition.y,
          }}
        >
          <ul>
            <li onClick={() => deleteFile(selectedFile)}>Delete</li>
            <li onClick={copyRequest}>Copy</li>
            <li onClick={makeNewFile}>Add File</li>
            <li>Rename</li>
          </ul>
        </div>
      )}
      <div className="file title">
        <p>Name:</p>
        <p>Type:</p>
        <p>Date Of Creation:</p>
        <p>Size:</p>
      </div>
      {fileArray.map((file, index) => {
        return (
          <Li key={file.id} delete={deleteFile} whoEdits={selectedFile || []} file={file} index={index} />
        );
      })}
    </div>
  );
}

export default FilesList;

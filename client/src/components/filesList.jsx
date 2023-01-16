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
  const [showContent, setShowContent] = useState("");
  const [url, setUrl] = useState("http://localhost:8080/users/admin");
  const [isInRoot, setIsInRoot] = useState(true);

  useEffect(() => {
    console.log("im here");
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setFileArray(data);
      });
  }, [status, url]);

  const moveBack = () => {
    let splitted = url.split("8080")[1].split("/");
    splitted.pop();
    let lastPath = splitted.join("/");
    let startPath = `http://localhost:8080`;
    const finalPath = `${startPath}${lastPath}`;
    setUrl(finalPath);
    finalPath === `http://localhost:8080/users/admin`
      ? setIsInRoot(true)
      : setIsInRoot(false);
  };

  const copyRequest = () => {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: selectedFile.type,
        intention: "copy",
        name: selectedFile.name,
      }),
    })
      .then((response) => {
        console.log(response.json());
      })
      .then(() => setStatus(!status));
  };

  const moveFile = () => {
    const path = prompt("What is the path that you want to move the file to:");
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: selectedFile.type,
        intention: "move",
        name: selectedFile.name,
        destination: path,
      }),
    })
      .then((res) => setStatus(!status))
      .catch((error) => console.log(error));
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
    setShowContent(false);
  };

  const showFile = () => {
    console.log(url + `/${selectedFile.name}`);
    fetch(url + `/${selectedFile.name}`)
      .then((response) => response.json())
      .then((data) => setShowContent(data.data));
  };

  const enterDir = () => {
    console.log(url + `/${selectedFile.name}`);
    setUrl((prev) => prev + `/${selectedFile.name}`);
    setIsInRoot(false);
  };

  function deleteFile(file) {
    fetch(url, {
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
    fetch(url, {
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
      <h5>{url}</h5>
      {!isInRoot && <button onClick={moveBack}>Move Up In Url</button>}

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
            <li onClick={showFile}>Show File</li>
            <li onClick={enterDir}>Enter Directory</li>
            <li onClick={moveFile}>Move File</li>
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
          <Li
            key={file.id}
            delete={deleteFile}
            whoEdits={selectedFile || []}
            file={file}
            index={index}
          />
        );
      })}
      {showContent && (
        <h3>
          {selectedFile.name}'s Content: {showContent}
        </h3>
      )}
    </div>
  );
}

export default FilesList;

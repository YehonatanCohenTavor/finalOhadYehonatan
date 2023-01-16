import React, { useState, useEffect } from "react";
import "../cssFiles/fileStyle.css";

function Li(props) {
  const [isSelected, toggleIsSelected] = useState(false);
  const [file, setFile] = useState(props.file);
  const [inEdit, setinEdit] = useState(false);
  const [name, setName] = useState(props.file.name);
  const [oldName, setOldName] = useState("");

  let path = `http://localhost:8080/users/admin`;

  function renameToServer() {
    setinEdit(!inEdit);
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldName: oldName, newName: name }),
    });
  }

  function makeEdit() {
    setOldName(name);
    setinEdit(!inEdit);
  }

  return (
    <div className="file" name={name}>
      {inEdit ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={renameToServer}
          autoFocus
        ></input>
      ) : (
        <p onClick={makeEdit}>{name}</p>
      )}
      <p>{file.type}</p>
      <p>{file.birth}</p>
      <p>{file.size}</p>
    </div>
  );
}

export default Li;

import React, { useState, useEffect } from "react";
import "../cssFiles/fileStyle.css";

function Li(props) {
  const [isSelected, toggleIsSelected] = useState(false);
  const [file, setFile] = useState(props.file);
  const [inEdit, setinEdit] = useState(false);
  const [name, setName] = useState(props.file.name);

  function renameToServer() {
    setinEdit(!inEdit);
  }

  if (!isSelected) {
    return (
      <div className="file">
        {inEdit ? (
          <input value={name} onChange={(e) => setName(e.target.value)}  onDoubleClick={renameToServer}></input>
        ) : (
          <p onClick={() => setinEdit(!inEdit)}>{name}</p>
        )}
        <p>{file.type}</p>
        <p>{file.birth}</p>
        <p>{file.size}</p>
      </div>
    );
  }
  return (
    <div className="file">
      <button>Edit Name</button>
      <button>Delete File</button>
    </div>
  );
}

export default Li;

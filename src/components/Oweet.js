import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Oweet = ({ oweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newOweet, setNewOweet] = useState(oweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete?");
    if (ok) {
      await dbService.doc(`oweets/${oweetObj.id}`).delete();
      await storageService.refFromURL(oweetObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(newOweet);
    await dbService.doc(`oweets/${oweetObj.id}`).update({
      text: newOweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewOweet(value);
  };

  return (
    <div className="oweet">
      {editing ? (
        isOwner ? (
          <>
            <form onSubmit={onSubmit} className="container oweetEdit">
              <input
                type="text"
                value={newOweet}
                required
                autoFocus
                onChange={onChange}
                className="formImput"
              ></input>
              <input type="submit" value="Update" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
          </>
        ) : null
      ) : (
        <>
          <h4>{oweetObj.text}</h4>
          {oweetObj.attachmentUrl ? (
            <img src={oweetObj.attachmentUrl} alt="" />
          ) : null}
          {isOwner ? (
            <div className="oweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Oweet;

import { dbService } from "fbase";
import React, { useState } from "react";

const Oweet = ({ oweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newOweet, setNewOweet] = useState(oweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete?");
    if (ok) await dbService.doc(`oweets/${oweetObj.id}`).delete();
  };

  const toggleEdditing = () => setEditing((prev) => !prev);

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newOweet}
              required
              onChange={onChange}
            ></input>
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEdditing}>Cancle</button>
        </>
      ) : (
        <>
          <h4>{oweetObj.text}</h4>
          {isOwner ? (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEdditing}>Edit</button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Oweet;

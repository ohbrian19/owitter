import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Oweet from "components/Oweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [oweet, setOweet] = useState("");
  const [oweets, setOweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService.collection("oweets").onSnapshot((snapshot) => {
      const oweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOweets(oweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const oweetObj = {
      text: oweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("oweets").add(oweetObj);

    setOweet("");
    setAttachment();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setOweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={oweet}
          onChange={onChange}
          placeholder="What's on your mind"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="oweet" />
        {attachment ? (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>clear</button>
          </div>
        ) : null}
      </form>
      <div>
        {oweets.map((oweet) => (
          <Oweet
            key={oweet.id}
            oweetObj={oweet}
            isOwner={oweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

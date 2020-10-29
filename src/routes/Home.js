import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Oweet from "components/Oweet";

const Home = ({ userObj }) => {
  const [oweet, setOweet] = useState("");
  const [oweets, setOweets] = useState([]);

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
    await dbService.collection("oweets").add({
      text: oweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setOweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setOweet(value);
  };

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
        <input type="submit" value="oweet" />
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

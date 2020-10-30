import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Oweet from "components/Oweet";
import OweetFactory from "components/OweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <div className="container">
      <OweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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

import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import FriendCard from "../friendCards/FriendCard";
import SendFriendRequest from "../sendFriendRequest/SendFriendRequest";
import IncomingFriendRequests from "../incomingFriendRequests/IncomingFriendRequests";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from "axios";

function Dashboard(cookies) {
  const history = useHistory();
  const [inputText, setInputText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const userToken = cookies.cookies.get("spotifyToken");

  const setValue = () => {
    let userInput = document.getElementById("status").value;
    setInputText(userInput);
  };

  useEffect(() => {
    const instance = axios.create({
      baseURL: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
      withCredentials: true,
    });

    instance.post("/profile/", {'token': userToken})
    .then((response) => {
        setUserProfile(response.data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
    }, []);

  const logOut = () => {
    cookies.cookies.remove("spotifyToken");
    history.push("/");
  };

  return (
    <Container fluid>
      <Row>
        <Col className="col-3">
          <Container className="profile-pic">
            <Image
              fluid
              src={userProfile === null ? "" : userProfile.pfp}
              roundedCircle
            />
          </Container>

          <Container className="recent-activity">
            <Container className="recent-text">Recent Activity</Container>
            <Card className="recent-song-card">
              <Card.Img
                variant="top"
                src={userProfile === null ? "" : userProfile.img_url}
                rounded="true"
              />
              <Container className="recent-info">
                <span className="user-recent-title">{userProfile === null ? "" : userProfile.song_name}</span>
                <span className="user-recent-artist">{userProfile === null ? "" : userProfile.song_artist}</span>
              </Container>
            </Card>
          </Container>
          <Container className="log-out-container">
            <button className="log-out-button" onClick={logOut}>
              Log out
            </button>
          </Container>
        </Col>
        <Col className="col-9">
          <div className="welcome">
            <h1 id="hello-name">{userProfile === null ? "Hello!" : `Hello ${userProfile.disp_name}!`}</h1>
          </div>
          <div className="user-id-container">
            <span className="user-id-span">{userProfile === null ? '' : `Your user ID is ${userProfile.user_id}`}</span>
          </div>
          {/* <div className="welcome-container">
            <input
              name="status"
              placeholder="How are you feeling right now?"
              type="text"
              maxLength="512"
              id="status"
              className="statusInput"
            />
            <Button onClick = {setValue} className="check-in-btn">Check In!</Button>{' '}
          </div> */}
          <SendFriendRequest user={userProfile ? userProfile.id : null} />
          <IncomingFriendRequests user={userProfile ? userProfile.id : null} />          
          <Container className="friends">
            <Container className="friends-recent">
              <h3>Your Friends' Recent Activity </h3>
            </Container>
            <Container className="inner-friend-container">
              <FriendCard
                name="Friend1"
                profilePicture="data:image/jpeg;base64,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"
                song="Call Me Maybe"
                artist="Carly Rae Jepsen"
                albumcover="data:image/jpeg;base64,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"
              ></FriendCard>
              <FriendCard></FriendCard>
              <FriendCard></FriendCard>
              <FriendCard></FriendCard>
              <FriendCard></FriendCard>
              <FriendCard></FriendCard>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

Dashboard.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Dashboard);

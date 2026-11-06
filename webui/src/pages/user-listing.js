import { FunctionComponent, useCallback } from "react";
import "../styles/user-listing.css";

const MyListing = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="myListing">
      <div className="homeHome" onClick={onHomeTextClick}>
        Home
      </div>
      <div className="exploreExplore" onClick={onHomeTextClick}>
        Explore
      </div>
      <div className="sessionsSessions" onClick={onHomeTextClick}>
        Sessions
      </div>
      <div className="teachASkill" onClick={onHomeTextClick}>
        Teach a skill
      </div>
      <div className="pointsFaqFilter120Po" onClick={onHomeTextClick}>
        <img className="iconSparkle" alt="" />
        <div className="points" onClick={onHomeTextClick}>
          120 points
        </div>
      </div>
      <img
        className="notificationsIconButton"
        alt=""
        onClick={onHomeTextClick}
      />
      <div className="profileFilterSm" onClick={onHomeTextClick}>
        <div className="points" onClick={onHomeTextClick}>
          SM
        </div>
      </div>
      <div className="headerDivider" />
      <div className="yourListing">YOUR LISTING</div>
      <b className="skatingBasics">Skating basics</b>
      <div className="aSkillYou">A skill you teach · Sara Moon · Calgary</div>
      <div className="skillIllustration}">
        <div className="ellipse" />
        <div className="ellipse2" />
        <img className="iconSkate" alt="" />
        <div className="sportsMovement">{`SPORTS & MOVEMENT`}</div>
      </div>
      <div className="card">
        <div className="aboutThisSkill">About this skill</div>
        <div className="beginnerSkatingFundamentals">
          Beginner skating fundamentals, balance, and confidence on the ice.
        </div>
      </div>
      <div className="card2">
        <div className="aboutThisSkill">Meeting details</div>
        <div className="beginnerSkatingFundamentals">
          Community centre lobby · Reception desk
          <br />
          Public library · Second floor, by the elevators
        </div>
      </div>
      <div className="card3">
        <b className="manageYourSkill">Manage your skill</b>
        <div className="pointsHour">
          15 points / hour · 60 minutes
          <br />
          In person · Intermediate
        </div>
        <div className="teachASkillButton" onClick={onHomeTextClick}>
          <div className="button" onClick={onHomeTextClick}>
            Edit listing
          </div>
        </div>
        <div className="availabilityButton" onClick={onHomeTextClick}>
          <div className="button" onClick={onHomeTextClick}>
            Manage availability
          </div>
        </div>
        <div className="profile" onClick={onHomeTextClick}>
          ← Back to profile
        </div>
      </div>
    </div>
  );
};

export default MyListing;

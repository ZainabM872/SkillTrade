import { FunctionComponent, useCallback } from "react";
import "../styles/listing-review.css";

const ReviewListing = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="reviewListing">
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
      <div className="activeNavigation" />
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
      <div className="readyToShare">READY TO SHARE?</div>
      <b className="reviewYourListing">Review your listing</b>
      <div className="checkTheDetails">
        Check the details, then publish your skill to your local community.
      </div>
      <div className="myListingSkatingBasics" onClick={onHomeTextClick}>
        <div className="skillIllustration">
          <div className="ellipse" />
          <div className="ellipse2" />
          <img className="iconSkate" alt="" />
          <div className="sportsMovement">{`SPORTS & MOVEMENT`}</div>
        </div>
        <div className="skatingBasics" onClick={onHomeTextClick}>
          Skating basics
        </div>
        <div className="saraMoon" onClick={onHomeTextClick}>
          Sara Moon · In person in Calgary
        </div>
        <div className="beginnerFriendly" onClick={onHomeTextClick}>
          Balance · Confidence · Fundamentals
        </div>
        <div className="pointsHour" onClick={onHomeTextClick}>
          15 points
        </div>
      </div>
      <div className="card">
        <div className="whatLearnersCan">What learners can expect</div>
        <div className="beginnerSkatingFundamentals">
          Beginner skating fundamentals, balance, and confidence on the ice.
        </div>
      </div>
      <div className="card2">
        <div className="whatLearnersCan">{`Availability & points`}</div>
        <div className="beginnerSkatingFundamentals">
          Select your days and save at least one start time.
        </div>
      </div>
      <div className="card3">
        <div className="whatLearnersCan">Meeting locations</div>
        <div className="beginnerSkatingFundamentals">
          Community centre lobby · Reception desk
          <br />
          Public library · Second floor, by the elevators
        </div>
      </div>
      <div className="homeButton" onClick={onHomeTextClick}>
        <div className="button" onClick={onHomeTextClick}>
          Publish skill
        </div>
      </div>
    </div>
  );
};

export default ReviewListing;

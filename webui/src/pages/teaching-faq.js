import { useCallback } from "react";
import "../styles/teaching-faq.css";

const TeachingFAQ = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="teachingFaq">
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
      <div className="skilltradeHelp">SKILLTRADE HELP</div>
      <b className="howDoI">How do I teach a skill?</b>
      <div className="shareSomethingYou">Share something you enjoy.</div>
      <div className="card">
        <div className="createYourListing">
          <div className="step1">
            <div className="div">01</div>
          </div>
          <div className="answer">
            <div className="createYourListing2">Create your listing</div>
            <div className="chooseTeachA">
              Choose Teach a skill. Add a clear title, category, description,
              difficulty, and session format.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="createYourListing">
          <div className="step1">
            <div className="div">02</div>
          </div>
          <div className="answer">
            <div className="createYourListing2">Set your availability</div>
            <div className="chooseTeachA">
              Pick your session length, available days, and start times. You can
              add more than one time per day.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="createYourListing">
          <div className="step1">
            <div className="div">03</div>
          </div>
          <div className="answer">
            <div className="createYourListing2">Review and publish</div>
            <div className="chooseTeachA">
              Add public or approved meeting locations with instructions. Review
              your listing, then publish. Earn 15 points for every teaching
              hour.
            </div>
          </div>
        </div>
      </div>
      <div className="backButton">
        <div className="button">Back</div>
      </div>
      <div className="helpButton" onClick={onHomeTextClick}>
        <div className="button2" onClick={onHomeTextClick}>
          All help topics
        </div>
      </div>
      <div className="card2">
        <div className="stillNeedA">Still need a hand?</div>
        <div className="wereHereTo">
          We’re here to help you learn and teach with confidence.
        </div>
      </div>
      <div className="contactSupportButton" onClick={onHomeTextClick}>
        <div className="button2" onClick={onHomeTextClick}>
          Contact support
        </div>
      </div>
    </div>
  );
};

export default TeachingFAQ;

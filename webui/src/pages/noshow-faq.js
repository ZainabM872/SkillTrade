import { useCallback } from "react";
import "../styles/noshow-faq.css";

const NoShowFAQ = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="noShowFaq">
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
      <b className="whatIfSomeone">What if someone doesn’t show up?</b>
      <div className="startWithThe">Start with the agreed meeting plan.</div>
      <div className="card">
        <div className="checkTheMeetingPlan">
          <div className="step1">
            <div className="div">01</div>
          </div>
          <div className="answer">
            <div className="checkTheMeeting">Check the meeting plan</div>
            <div className="checkYourSessions">
              Check your session’s date, time, location, and meeting
              instructions. Mark that you’ve arrived when you reach the meeting
              point.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="checkTheMeetingPlan">
          <div className="step1">
            <div className="div">02</div>
          </div>
          <div className="answer">
            <div className="checkTheMeeting">Find each other safely</div>
            <div className="checkYourSessions">
              Use optional location sharing if you need help finding each other.
              Respect your learning partner’s privacy.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="checkTheMeetingPlan">
          <div className="step1">
            <div className="div">03</div>
          </div>
          <div className="answer">
            <div className="checkTheMeeting">Report what happened</div>
            <div className="checkYourSessions">
              If the session didn’t happen, report attendance accurately.
              Contact support for help with a no-show or safety concern.
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

export default NoShowFAQ;

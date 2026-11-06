import { useCallback } from "react";
import "../styles/cancellation-faq.css";

const CancellationFAQ = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="cancellationFaq">
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
      <b className="canICancel">Can I cancel or reschedule?</b>
      <div className="keepYourLearning">
        Keep your learning partner in the loop.
      </div>
      <div className="card">
        <div className="openYourSession">
          <div className="step1">
            <div className="div">01</div>
          </div>
          <div className="answer">
            <div className="give48Hours">Open your session</div>
            <div className="openTheSession">
              Open the session from Sessions, then choose Cancel or Reschedule.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="openYourSession">
          <div className="step1">
            <div className="div">02</div>
          </div>
          <div className="answer">
            <div className="give48Hours">Give 48 hours’ notice</div>
            <div className="openTheSession">
              Make changes at least 48 hours before the session. Choose a new
              available date and time when rescheduling.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="openYourSession">
          <div className="step1">
            <div className="div">03</div>
          </div>
          <div className="answer">
            <div className="give48Hours">Confirm the change</div>
            <div className="openTheSession">
              Check Sessions afterward to confirm the updated status and meeting
              details.
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

export default CancellationFAQ;

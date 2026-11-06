import { useCallback } from "react";
import "../styles/booking-faq.css";

const BookingFAQ = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="bookingFaq">
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
      <b className="howDoI">How do I book a session?</b>
      <div className="fromCuriosityTo">
        From curiosity to your next class.
      </div>
      <div className="card">
        <div className="findYourNextSkill}">
          <div className="step1}">
            <div className="div">01</div>
          </div>
          <div className="answer}">
            <div className="findYourNext">Find your next skill</div>
            <div className="exploreSkillsOr">
              1. Explore skills or search for something you’d like to learn.
              <br />
              2. Open a skill to review the teacher, description, and points.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="findYourNextSkill">
          <div className="step1">
            <div className="div">02</div>
          </div>
          <div className="answer">
            <div className="findYourNext">Choose the details</div>
            <div className="exploreSkillsOr">
              3. Choose an available date and time.
              <br />
              4. Select a meeting location and review the cost.
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="findYourNextSkill">
          <div className="step1">
            <div className="div">03</div>
          </div>
          <div className="answer">
            <div className="findYourNext">Send your request</div>
            <div className="exploreSkillsOr">
              5. Send your request.
              <br />
              6. Check Sessions for your teacher’s confirmation and meeting
              instructions.
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

export default BookingFAQ;

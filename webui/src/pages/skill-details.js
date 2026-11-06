import { useCallback } from "react";
import "../styles/skill-details.css";

const SkillDetail = () => {
  const onHomeTextClick = useCallback(() => {}, []);

  return (
    <div className="skillDetail">
      <div className="homeHome" onClick={onHomeTextClick}>
        Home
      </div>
      <div className="exploreExplore" onClick={onHomeTextClick}>
        Explore
      </div>
      <div className="activeNavigation" />
      <div className="sessionsSessions" onClick={onHomeTextClick}>
        Sessions
      </div>
      <div className="teachASkill" onClick={onHomeTextClick}>
        Teach a skill
      </div>
      <div className="pointsFaqFilter120Po" onClick={onHomeTextClick}>
        <img className="../styles/icons/sparkle.svg" alt="" />
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
      <div className="back">← Back to results</div>
      <div className="skillIllustration">
        <div className="ellipse" />
        <div className="ellipse2" />
        <img className="iconGuitar" alt="" />
        <img className="iconLanguage" alt="" />
        <img className="iconLanguage" alt="" />
        <img className="iconLanguage" alt="" />
        <div className="musicBeginner">MUSIC · BEGINNER FRIENDLY</div>
      </div>
      <div className="musicBeginner2">MUSIC · BEGINNER FRIENDLY</div>
      <b className="acousticGuitar">Acoustic guitar</b>
      <div className="learnChordsStrumming">
        Learn chords, strumming patterns, and your first full song. No previous
        guitar experience required.
      </div>
      <div className="card">
        <div className="meetAlexMorgan">Alex Morgan</div>
        <div className="from32Real">
          ★ 4.9 from 32 real sessions · 18 sessions taught
        </div>
      </div>
      <div className="card2">
        <div className="meetAlexMorgan">What to bring</div>
        <div className="from32Real">
          Bring a guitar if you have one. Let Alex know if you need to borrow
          one before your session.
        </div>
      </div>
      <div className="card3">
        <div className="yourNextNew">Your next new skill</div>
        <b className="pointsHour">15 points / hour</b>
        <div className="minuteSession">60-minute session · In person</div>
        <b className="meetInPerson">Meet in person</b>
        <div className="communityCentreLobbyMeet">
          Community centre lobby
          <br />
          Meet by the reception desk in the lobby.
          <br />
          <br />
          Public library · second floor
          <br />
          Meet by the elevators.
        </div>
        <div className="bookASessionButton" onClick={onHomeTextClick}>
          <div className="button" onClick={onHomeTextClick}>
            Book a session
          </div>
        </div>
        <div className="pointsFaq" onClick={onHomeTextClick}>
          How do points work? ↗
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;

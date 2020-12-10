import styled from "styled-components";
import { format } from "date-fns";
import seed from "seed-random";
import { randomInt } from "../utils";

const StyledSentStamp = styled.div<{ rotation: number }>`
  width: 10vw;
  height: 10vw;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  bottom: 1vw;
  right: 1vw;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 2.8vw;
  font-size: 1vw;
  transform: rotate(${(p) => p.rotation}deg);
  mix-blend-mode: overlay;
  z-index: 1;
`;

const Day = styled.p`
  font-size: 2em;
  margin: 0;
`;

const Month = styled.p`
  font-size: 1.25em;
  margin: 0;
`;

const Year = styled.p`
  font-size: 1.25em;
  margin: 0;
`;

const StampOne = styled(StyledSentStamp)`
  background-image: url("/sent-1.png");
`;

const StampTwo = styled(StyledSentStamp)`
  background-image: url("/sent-2.png");
  padding: 10% 0 0;
  font-size: 1vw;
`;

const StampThree = styled(StyledSentStamp)`
  background-image: url("/sent-3.png");
`;

interface SentStampProps {
  date: number;
  id: string;
}

export function SentStamp({ date, id }: SentStampProps) {
  const day = format(new Date(date), "dd");
  const month = format(new Date(date), "MMM");
  const year = format(new Date(date), "yyyy");
  const longDate = format(new Date(date), "dd-MM-yyyy");
  const stamps = ["one", "two", "three"];
  const stampVariant = stamps[randomInt(0, stamps.length - 1, seed(id))];
  const rotation = randomInt(-30, 30, seed(id));

  if (stampVariant === "one") {
    return (
      <StampOne rotation={rotation}>
        <Month>{month}</Month>
        <Day>{day}</Day>
        <Year>{year}</Year>
      </StampOne>
    );
  } else if (stampVariant === "two") {
    return <StampTwo rotation={rotation}>{longDate}</StampTwo>;
  } else if (stampVariant === "three") {
    return (
      <StampThree rotation={rotation}>
        <Month>{month}</Month>
        <Day>{day}</Day>
        <Year>{year}</Year>
      </StampThree>
    );
  }

  return null;
}

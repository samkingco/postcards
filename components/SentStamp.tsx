import styled, { css } from "styled-components";
import { format } from "date-fns";
import seed from "seed-random";
import { randomInt } from "../utils";

const StyledSentStamp = styled.div<{ rotation: number; $isLarger: boolean }>`
  width: 120px;
  height: 120px;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  bottom: 6%;
  right: 6%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 36px;
  font-size: 10px;
  transform: rotate(${(p) => p.rotation}deg);
  mix-blend-mode: overlay;
  z-index: 1;

  ${(props) =>
    props.$isLarger &&
    css`
      @media screen and (min-width: 640px) {
        width: 200px;
        height: 200px;
        font-size: 20px;
        padding: 56px;
      }
    `}
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
  padding: 24px 0 0;
  font-size: 12px;

  ${(props) =>
    props.$isLarger &&
    css`
      @media screen and (min-width: 640px) {
        font-size: 20px;
        padding: 40px 0 0;
      }
    `}
`;

const StampThree = styled(StyledSentStamp)`
  background-image: url("/sent-3.png");
`;

interface SentStampProps {
  className?: string;
  date: number;
  id: string;
  isLarger?: boolean;
}

export function SentStamp({ className, date, id, isLarger }: SentStampProps) {
  const day = format(new Date(date), "dd");
  const month = format(new Date(date), "MMM");
  const year = format(new Date(date), "yyyy");
  const longDate = format(new Date(date), "dd-MM-yyyy");
  const stamps = ["1", "2", "3"];
  const stampVariant = stamps[randomInt(0, stamps.length, seed(id))];
  const rotation = randomInt(-45, 45, seed(id));

  if (stampVariant === "1") {
    return (
      <StampOne className={className} $isLarger={isLarger} rotation={rotation}>
        <Month>{month}</Month>
        <Day>{day}</Day>
        <Year>{year}</Year>
      </StampOne>
    );
  } else if (stampVariant === "2") {
    return (
      <StampTwo className={className} $isLarger={isLarger} rotation={rotation}>
        {longDate}
      </StampTwo>
    );
  } else if (stampVariant === "3") {
    return (
      <StampThree
        className={className}
        $isLarger={isLarger}
        rotation={rotation}
      >
        <Month>{month}</Month>
        <Day>{day}</Day>
        <Year>{year}</Year>
      </StampThree>
    );
  }

  return null;
}

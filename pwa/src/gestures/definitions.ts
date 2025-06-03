import {
  GestureDescription,
  Finger,
  FingerCurl,
  FingerDirection,
} from 'fingerpose';

export enum GestureID {
  TwoUp = 'Move Forward',
  TwoDown = 'Move Backward',
  ThumbLeft = 'Turn Left',
  ThumbRight = 'Turn Right',
  ThumbUp = 'Look Up',
  ThumbDown = 'Look Down',
  DisableGestures = 'Disable Gestures', // 👈 new
}

/* ---------------------------------------------------------------- */
/* 1) Two fingers UP ↗ (“Move Forward”)                             */
/* ---------------------------------------------------------------- */
const twoUp = new GestureDescription(GestureID.TwoUp);
twoUp.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
twoUp.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
twoUp.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
twoUp.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
[Finger.Ring, Finger.Pinky, Finger.Thumb].forEach((f) => {
  twoUp.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 2) Two fingers DOWN ↘ (“Move Backward”)                          */
/* ---------------------------------------------------------------- */
const twoDown = new GestureDescription(GestureID.TwoDown);
twoDown.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
twoDown.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
twoDown.addDirection(Finger.Index, FingerDirection.VerticalDown, 1.0);
twoDown.addDirection(Finger.Middle, FingerDirection.VerticalDown, 1.0);
[Finger.Ring, Finger.Pinky, Finger.Thumb].forEach((f) => {
  twoDown.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 3) Thumb LEFT ← (“Turn Left”)                                     */
/* ---------------------------------------------------------------- */
const thumbLeft = new GestureDescription(GestureID.ThumbLeft);
thumbLeft.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbLeft.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((f) => {
  thumbLeft.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 4) Thumb RIGHT → (“Turn Right”)                                   */
/* ---------------------------------------------------------------- */
const thumbRight = new GestureDescription(GestureID.ThumbRight);
thumbRight.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbRight.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((f) => {
  thumbRight.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 5) Thumb UP ↑ (“Look Up”)                                          */
/* ---------------------------------------------------------------- */
const thumbUp = new GestureDescription(GestureID.ThumbUp);
thumbUp.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbUp.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((f) => {
  thumbUp.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 6) Thumb DOWN ↓ (“Look Down”)                                      */
/* ---------------------------------------------------------------- */
const thumbDown = new GestureDescription(GestureID.ThumbDown);
thumbDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbDown.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((f) => {
  thumbDown.addCurl(f, FingerCurl.FullCurl, 1.0);
});

/* ---------------------------------------------------------------- */
/* 7) Open Palm ↑ (“Disable Gestures”)                               */
/*    All five fingers fully extended & pointing up.                 */
/* ---------------------------------------------------------------- */
const disableGestures = new GestureDescription(GestureID.DisableGestures);
[Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach(
  (f) => {
    disableGestures.addCurl(f, FingerCurl.NoCurl, 1.0);
    disableGestures.addDirection(f, FingerDirection.VerticalUp, 1.0);
  }
);

export const gestureMap = {
  [GestureID.TwoUp]: twoUp,
  [GestureID.TwoDown]: twoDown,
  [GestureID.ThumbLeft]: thumbLeft,
  [GestureID.ThumbRight]: thumbRight,
  [GestureID.ThumbUp]: thumbUp,
  [GestureID.ThumbDown]: thumbDown,
  [GestureID.DisableGestures]: disableGestures, // 👈 new
};
